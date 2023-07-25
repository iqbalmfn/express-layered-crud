const express = require("express");
const { body } = require("express-validator");
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  updatedProductById,
  getAllProductsWithPagination,
} = require("./product.service");
const {
  successResponse,
  errorResponse,
  formErrorValidation,
  paginationFormat,
} = require("../utils/utils");

const router = express.Router();

let statusCode;
let response;

router.get("/", async (req, res) => {
  if (req.query.page || req.query.pageSize) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const result = await getAllProductsWithPagination(page, pageSize);

    response = paginationFormat(
      "Successfully get produtcs",
      result.products,
      result.totalItems,
      result.currentPage,
      result.totalPages,
      pageSize
    );
  } else {
    const products = await getAllProducts();

    response = successResponse(products, "Sucessfully get products");
  }

  res.json(response);
});

router.get("/:id", async (req, res) => {
  const productId = req.params.id;

  if (isNaN(productId)) {
    statusCode = 400;
    response = errorResponse("ID is not a number");
  } else {
    const product = await getProductById(parseInt(productId));

    if (product) {
      statusCode = 200;
      response = successResponse(product, "Successfully get product by ID");
    } else {
      statusCode = 400;
      response = errorResponse("Product not found");
    }
  }

  res.status(statusCode).send(response);
});

router.post(
  "/",
  // Validation middleware
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ],
  async (req, res) => {
    // Check if there are validation errors
    formErrorValidation(req, res);

    const newProductData = req.body;

    try {
      const product = await createProduct(newProductData);

      const response = successResponse(product, "Successfully created product");

      res.status(201).send(response);
    } catch (error) {
      res
        .status(500)
        .send(errorResponse("An error occurred while creating the product"));
    }
  }
);

router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ],
  async (req, res) => {
    // Check if there are validation errors
    formErrorValidation(req, res);

    const productId = req.params.id;
    const productData = req.body;

    try {
      if (isNaN(productId)) {
        statusCode = 400;
        response = errorResponse("ID is not a number");
      } else {
        const product = await updatedProductById(
          parseInt(productId),
          productData
        );

        if (!product) {
          statusCode = 400;
          response = errorResponse("Product not found");
        } else {
          statusCode = 200;
          response = successResponse(product, "Successfully updated product");
        }
      }

      res.status(statusCode).send(response);
    } catch (error) {
      res
        .status(500)
        .send(errorResponse("An error occurred while updating the product"));
    }
  }
);

router.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  if (isNaN(productId)) {
    statusCode = 400;
    response = errorResponse("ID is not a number");
  } else {
    const product = await deleteProductById(parseInt(productId));

    if (!product) {
      statusCode = 400;
      response = errorResponse("Product not found");
    } else {
      statusCode = 200;
      response = successResponse(product, "Successfully deleted product");
    }
  }

  res.status(statusCode).send(response);
});

module.exports = router;
