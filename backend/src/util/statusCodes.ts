enum HttpStatusCodes {
  // Informational Responses -->
  CONTINUE = 100,
  
  // Successful Responses -->
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  //Redirection Messages -->
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,

  //   Client Error Responses -->
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  TOO_MANY_REQUESTS = 429,

  // Server Error Responses -->
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export default HttpStatusCodes;