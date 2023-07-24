const express = require("express");
const prisma = require("../db");
const { body, validationResult } = require("express-validator");
const {
  getAllProducts,
  getProductById,
  formErrorValidation,
  createProduct,
} = require("./product.service");
const { successResponse, errorResponse } = require("../utils/response");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await getAllProducts();

  const response = successResponse(products, "Sucessfully get products");

  res.send(response);
});

router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await getProductById(productId);

  res.status(product.statusCode).send(product.response);
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

router.put("/:id", async (req, res) => {
  const productId = req.params.id;
  const productData = req.body;

  try {
    const product = await prisma.product.update({
      where: {
        id: parseInt(productId),
      },
      data: productData,
    });

    const response = {
      success: true,
      message: "Successfully updated product",
      data: product,
    };

    res.status(200).send(response);
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).send({
        success: false,
        message: "Product not found",
      });
    } else {
      res.status(500).send({
        success: false,
        message: "An error occurred while updating the product",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  const product = await prisma.product.delete({
    where: { id: parseInt(productId) },
  });

  const response = {
    success: true,
    message: "Successfully deleted products",
    data: product,
  };

  res.status(200).send(response);
});

module.exports = router;
