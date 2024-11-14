const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "UAV Store API Documentation",
    version: "1.0.0",
    description: "API documentation for the UAV Store",
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./Routes/*.js", "./app.js"], // Đường dẫn tới các file chứa chú thích cho Swagger
};

const swaggerSpecs = swaggerJSDoc(options);

module.exports = swaggerSpecs;
