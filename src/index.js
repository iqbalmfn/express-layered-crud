const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");

const prisma = new PrismaClient();
const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/products", async (req, res) => {
  const product = await prisma.product.findMany();

  const response = {
    success: true,
    message: "Successfully get products",
    data: product,
  };

  res.send(response);
});

app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await prisma.product.findFirst({
    where: { id: parseInt(productId) },
  });

  let statusCode
  let response
  if (product) {
    statusCode = 200;
    response = {
      success: true,
      message: "Successfully get product by id",
      data: product,
    };
  } else {
    statusCode = 400;
    response = {
      success: false,
      message: "Product not found",
    };
  }

  res.status(statusCode).send(response);
});

app.post(
  "/products",
  // Validation middleware
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    // You can add more validation rules here for other fields of the product
  ],
  async (req, res) => {
    // Check if there are validation errors
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

    const newProductData = req.body;

    try {
      const product = await prisma.product.create({
        data: newProductData,
      });

      const response = {
        success: true,
        message: "Successfully created product",
        data: product,
      };

      res.status(201).send(response);
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "An error occurred while creating the product",
      });
    }
  }
);

app.put("/products/:id", async (req, res) => {
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

app.delete("/products/:id", async (req, res) => {
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

app.listen(PORT, () => {
  console.log("Express API running on port " + PORT);
});
