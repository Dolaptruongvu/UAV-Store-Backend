const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
const slugify = require("slugify"); // Sử dụng thư viện slugify để tạo slug

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
      unique: true,
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    batteryLife: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    range: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    maxSpeed: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sensorType: {
      type: DataTypes.STRING,
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
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    compatibility: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    isProminent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment:
        "Indicates if the product is prominent (e.g., featured or highlighted)",
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: false,
    hooks: {
      beforeCreate: (product) => {
        if (!product.slug && product.name) {
          product.slug = slugify(product.name, { lower: true, strict: true });
        }
      },
      beforeUpdate: (product) => {
        if (!product.slug && product.name) {
          product.slug = slugify(product.name, { lower: true, strict: true });
        }
      },
    },
  }
);

module.exports = Product;
