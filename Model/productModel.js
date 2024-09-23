const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");

class Product extends Model {}

Product.init(
  {
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notEmpty: {
          msg: "Product name is required",
        },
        len: {
          args: [0, 100],
          msg: "Product name cannot exceed 100 characters",
        },
      },
      unique: true
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notEmpty: {
          msg: "Manufacturer is required",
        },
      },
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Category is required",
        },
      },
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.STRING, // có thể dùng dạng "Dài x Rộng x Cao" hoặc lưu dưới dạng JSON
      allowNull: true,
    },
    batteryLife: {
      type: DataTypes.STRING, // có thể lưu dưới dạng "30 phút", "1 giờ", v.v.
      allowNull: true,
    },
    range: {
      type: DataTypes.FLOAT, // khoảng cách hoạt động, ví dụ: 10.5 km
      allowNull: true,
    },
    maxSpeed: {
      type: DataTypes.FLOAT, // tốc độ tối đa, ví dụ: 60.0 km/h
      allowNull: true,
    },
    sensorType: {
      type: DataTypes.STRING, // loại cảm biến, ví dụ: "LiDAR", "Camera 4K"
      allowNull: true,
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Release date is required",
        },
        isDate: {
          msg: "Release date must be a valid date",
        },
      },
    },
    supplier: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notEmpty: {
          msg: "Supplier is required",
        },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required",
        },
      },
    },
    ratings: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: "Rating must be above 1.0",
        },
        max: {
          args: [5],
          msg: "Rating must be below 5.0",
        },
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Price is required",
        },
        isFloat: {
          msg: "Price must be a number",
        },
      },
    },
    accessoriesIncluded: {
      type: DataTypes.ARRAY(DataTypes.STRING), // liệt kê các phụ kiện đi kèm
      allowNull: true,
    },
    compatibility: {
      type: DataTypes.STRING, // lưu thông tin về khả năng tương thích, ví dụ: "Compatible with DJI Mavic"
      allowNull: true,
    },
    type: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: false,
  }
);

module.exports = Product;
