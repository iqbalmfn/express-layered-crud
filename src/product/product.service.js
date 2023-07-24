const { validationResult } = require("express-validator");
const prisma = require("../db");
const { successResponse, errorResponse } = require("../utils/response");

const getAllProducts = async () => {
  const products = await prisma.product.findMany();

  return products;
};

const getProductById = async (id) => {
  let statusCode;
  let response;

  if (typeof id !== "number") {
    statusCode = 400;
    response = errorResponse("ID is not a number");
  } else {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (product) {
      statusCode = 200;
      response = successResponse(product, "Successfully get product by ID");
    } else {
      statusCode = 400;
      response = errorResponse("Product not found");
    }
  }

  return {
    statusCode,
    response,
  };
};

const formErrorValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().reduce((acc, error) => {
      acc[error.path] = error.msg;
      return acc;
    }, {});

    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errorMessages,
    });
  }
};

const createProduct = async (productData) => {
  const product = await prisma.product.create({
    data: productData,
  });

  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  formErrorValidation,
  createProduct
};
