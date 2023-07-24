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
    message: message
  };

  let response = []
  if (errors) {
    response  = {...defaultResponse, ...errors}
  }

  return response;
};

module.exports = {
  successResponse,
  errorResponse,
};
