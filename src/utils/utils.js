const { validationResult } = require("express-validator");

const successResponse = (data = [], message = "") => {
  const response = {
    success: true,
    message: message,
    data: data,
  };

  return response;
};

const errorResponse = (message = "", errors = []) => {
  const defaultResponse = {
    success: false,
    message: message,
  };

  let response = [];
  if (errors) {
    response = { ...defaultResponse, ...errors };
  }

  return response;
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

const paginationFormat = (
  message = "",
  data,
  totalItems,
  currentPage,
  totalPages,
  pageSize
) => {
  response = {
    success: true,
    message: message,
    data: data,
    meta: {
      totalItems: totalItems,
      currentPage: currentPage,
      totalPages: totalPages,
      pageSize: pageSize,
    },
  };

  return response;
};

module.exports = {
  successResponse,
  errorResponse,
  formErrorValidation,
  paginationFormat,
};
