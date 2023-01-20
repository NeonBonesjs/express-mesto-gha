/* eslint-disable max-classes-per-file */
const NOT_FOUND_CODE = 404;
const NOT_VALID_CODE = 400;
const DEFAULT_ERROR_CODE = 500;

module.exports = { NOT_FOUND_CODE, NOT_VALID_CODE, DEFAULT_ERROR_CODE };

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.statusCode = code;
  }
}

module.exports = {
  NotFoundError, ValidationError, AuthorizationError, CustomError,
};
