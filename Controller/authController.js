const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Customer = require("../Model/customerModel"); // Sequelize model
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const { decode } = require("punycode");

const signToken = (id, secret, expire) => {
  return jwt.sign({ id }, secret, {
    expiresIn: expire,
  });
};

const createSendToken = (customer, statusCode, req, res) => {
  const token = signToken(
    customer.id, // Use Sequelize's primary key (id)
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN
  );
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite: "none",
  };
  console.log("Generated JWT Token:", token);
  res.cookie("jwt", token, cookieOptions);

  customer.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      customer,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await Customer.create(req.body);
  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const customer = await Customer.findOne({ where: { email } });

  if (
    !customer ||
    !(await customer.correctPassword(password, customer.password))
  ) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(customer, 200, req, res);
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    // Kiểm tra xem cookie jwt có tồn tại không
    console.log("Cookies received:", req.cookies);
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      console.log("Decoded JWT:", decoded); // Log JWT đã được giải mã

      // Tìm khách hàng theo ID từ JWT
      const currentUser = await Customer.findByPk(decoded.id);
      if (!currentUser) {
        console.log("User not found!");
        return next(new AppError("User not found", 404));
      }

      req.customer = currentUser; // Gán thông tin khách hàng vào req
      res.locals.customer = currentUser;

      console.log("Authenticated user:", currentUser);
      return next();
    }
  } catch (err) {
    console.error("JWT verification failed:", err);
    return next(new AppError("Failed to authenticate user", 401));
  }
  next();
};

exports.logout = (req, res) => {
  res.cookie("jwt", "logouttoken", {
    expires: new Date(Date.now()), // Đặt thời gian hết hạn là hiện tại
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite: "none",
  });
  res.status(200).json({
    status: "success",
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await Customer.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again", 401)
    );
  }

  req.customer = currentUser;
  res.locals.customer = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.customer.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.preventSetRight = catchAsync(async (req, res, next) => {
  if (req.body.role === "user" || !req.body.role) {
    return next();
  } else {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }
});
