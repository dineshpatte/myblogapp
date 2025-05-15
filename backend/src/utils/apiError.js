class ApiError extends Error {
  constructor(
    statusCode,
    errors = [],
    message = "something went wrong",
    stack = ""
  ) {
    super(message);
    (this.statusCode = statusCode),
      (this.data = null),
      (this.message = message),
      (this.errors = errors),
      (this.success = false);

    if (stack) {
      this.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
