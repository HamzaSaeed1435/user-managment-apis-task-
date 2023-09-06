/**
 * Extract properties from request based on flags.
 * will get all data from request.body , req.query, req.params based on flags if true
 * merged all and then return in one object
 */
function getQueryParams(req, bodyProperties, queryProperties = false, paramsProperties = false) {
  const extractedData = {};

  if (bodyProperties) {
    Object.assign(extractedData, req.body);
  }

  if (queryProperties) {
    Object.assign(extractedData, req.query);
  }

  if (paramsProperties) {
    Object.assign(extractedData, req.params);
  }

  return extractedData;
}


  /**
 * Check if a variable is empty, undefined, null, or contains a valid value.
 */
function isNullOrEmpty(value) {
    if (value === undefined || value === null || value === '') {
      return true;
    }
  
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
  
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
  
    return false;
  }
  

 /**
  * this fucntion for generating a standard resposne
  */
  function generateResponse(status, code, data = {}, error = null) {
    data = data ? data : {};
    error = error ? error : null;
  
    const response = {
      status: status,
      code: code,
      data: data,
      error: error,
    };
  
    return response;
  }
  


  
  module.exports = {getQueryParams, isNullOrEmpty, generateResponse};
  