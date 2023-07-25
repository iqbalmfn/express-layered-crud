const prisma = require("../db");

const getAllProducts = async () => {
  const products = await prisma.product.findMany();

  return products;
};

const getAllProductsWithPagination = async (page, pageSize) => {
  const totalItems = await prisma.product.count();
  const products = await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    totalItems,
    products,
    currentPage: page,
    totalPages: Math.ceil(totalItems / pageSize),
    pageSize,
  };
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  return product;
};

const createProduct = async (productData) => {
  const product = await prisma.product.create({
    data: productData,
  });

  return product;
};

const updatedProductById = async (id, productData) => {
  //cek product
  const checkProduct = await getProductById(id);

  if (checkProduct) {
    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: productData,
    });

    return product
  }
};

const deleteProductById = async (id) => {
  //cek product
  const checkProduct = await getProductById(id);

  if (checkProduct) {
    const product = await prisma.product.delete({
      where: { id: id },
    });

    return product;
  }
};

module.exports = {
  getAllProducts,
  getAllProductsWithPagination,
  getProductById,
  createProduct,
  updatedProductById,
  deleteProductById,
};
