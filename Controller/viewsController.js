const Product = require("../Model/productModel"); // Import the Product model
const Bill = require("../Model/billModel");
const { catchAsync } = require("../utils/catchAsync"); // Import catchAsync helper
const Customer = require("../Model/customerModel");
const { Op } = require("sequelize");

exports.getOverview = catchAsync(async (req, res, next) => {
  const famousProducts = await Product.findAll({
    where: { ratings: { [Op.gte]: 4.7 } },
  });
  const specialOffer = await Product.findAll({
    where: { price: { [Op.lte]: 10 } },
  });

  res.status(200).render("index", {
    famousProducts, // Pass the products data to the template
    specialOffer,
  });
});

//login page
exports.getLogin = catchAsync(async (req, res, next) => {
  if (res.locals?.customer) {
    res.redirect("/");
    return;
  }
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

//signup page
exports.getSignup = catchAsync(async (req, res, next) => {
  if (res.locals?.customer) {
    res.redirect("/");
    return;
  }
  res.status(200).render("signup", {});
});

// show filtered products
exports.filteredProducts = catchAsync(async (req, res, next) => {
  const { date, s, p } = req.query; // Get the query parameters
  const queryUrl = new URLSearchParams();

  const categoriesQuery = Object.entries(req.query)
    .filter((item) => item[0].search("categories-") > -1)
    .map((item) => item[1]);

  let query = {};

  // category
  if (categoriesQuery.length > 0) {
    query = { category: { [Op.in]: categoriesQuery } };
    categoriesQuery.forEach((item, index) => {
      queryUrl.append("categories-" + index, item);
    });
  }

  // date
  if (date) {
    query = {
      ...query,
      releaseDate: new Date(date),
    };
    queryUrl.append("date", date);
  }

  if (!!s) {
    query = { ...query, name: { [Op.like]: `%${s}%` } };
    queryUrl.append("s", s);
  }

  // pagination
  const limit = 12;
  let page = 1;
  if (p && !isNaN(Number(p))) {
    page = Number(p);
  }

  const products = await Product.findAll({
    where: query,
    limit,
    offset: (page - 1) * limit,
  });

  const totalRecords = await Product.count({
    where: query,
  });

  const totalPage = Math.ceil(totalRecords / limit);
  const currentQueryUrlString = !queryUrl.toString().trim()
    ? "?="
    : queryUrl.toString();
  const previousPage =
    page === 1 ? null : `${currentQueryUrlString}&p=${page - 1}`;
  const nextPage =
    page === totalPage ? null : `${currentQueryUrlString}&p=${page + 1}`;

  res.status(200).render("product-filter", {
    products,
    pagination: {
      totalRecords,
      totalPage,
      previousPage,
      nextPage,
    },
    currentQueryUrlString,
  });
});

// show shipping bills
exports.getShipBills = catchAsync(async (req, res, next) => {
  const bills = await Bill.findAll({
    where: { shipperId: req.customer.id },
  });

  res.status(200).render("", {
    bills,
  });
});

// show profile
exports.getProfile = catchAsync(async (req, res, next) => {
  const user = res.locals.customer;
  const { page, name } = req.query;

  if (!user) {
    res.redirect("/login?r=/profile");
    return;
  }

  const filter =
    user.role === "user" ? { customerId: user.id } : { shipperId: user.id };

  const listBills = await Bill.findAll({ where: filter });

  const products = [];
  if (name && page === "edit") {
    const productsDb = await Product.findAll({
      where: { name: { [Op.like]: `%${name}%` } },
    });
    productsDb.forEach((product) => {
      products.push(product);
    });
  }
  res.status(200).render("profile", {
    listBills,
    page,
    products,
  });
});

//Product Detail
exports.getProductDetail = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findByPk(productId);
  res.status(200).render("product-detail", {
    product,
  });
});

//Cart
exports.getCart = catchAsync(async (req, res, next) => {
  const cartItems = req.cookies;
  const prods = Object.entries(req.cookies)
    .filter((item) => item[0].search("cart-") > -1)
    .reduce((pre, curr) => {
      if (Number(curr[1]) <= 0) return pre;
      return {
        ...pre,
        [curr[0].split("-")[1]]: Number(curr[1]),
      };
    }, {});

  const listProducts = await Product.findAll({
    where: { id: { [Op.in]: Object.keys(prods) } },
  });

  const totalPrice = listProducts.reduce(
    (pre, curr) => pre + Number(curr.price) * prods[curr.id],
    0
  );

  res.status(200).render("cart-item", {
    products: listProducts.map((item) => ({
      ...item.toJSON(),
      userQuantity: prods[item.id],
      totalPrice: prods[item.id] * item.price,
    })),
    totalPrice,
  });
});

//getContracts
exports.getContracts = (req, res, next) => {
  res.status(200).render("contact");
};

//getContracts
exports.getSuccess = catchAsync(async (req, res, next) => {
  const billId = req.params.billId;
  const bill = await Bill.findByPk(billId);

  res.status(200).render("success", {
    bill,
  });
});
