class ServiceResult {
  constructor(code, message, data) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  body() {
    return {
      message: this.message,
      data: this.data,
    };
  }
}

exports = { ServiceResult };
