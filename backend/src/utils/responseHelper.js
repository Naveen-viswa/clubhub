// Standard success response
const success = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };
  
  // Standard error response
  const error = (res, message = 'Error', statusCode = 500, errors = null) => {
    const response = {
      success: false,
      message
    };
    
    if (errors) {
      response.errors = errors;
    }
    
    return res.status(statusCode).json(response);
  };
  
  // Validation error response
  const validationError = (res, errors) => {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  };
  
  // Not found response
  const notFound = (res, resource = 'Resource') => {
    return res.status(404).json({
      success: false,
      message: `${resource} not found`
    });
  };
  
  // Unauthorized response
  const unauthorized = (res, message = 'Unauthorized') => {
    return res.status(401).json({
      success: false,
      message
    });
  };
  
  // Forbidden response
  const forbidden = (res, message = 'Forbidden') => {
    return res.status(403).json({
      success: false,
      message
    });
  };
  
  module.exports = {
    success,
    error,
    validationError,
    notFound,
    unauthorized,
    forbidden
  };
  