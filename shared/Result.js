class Result {
  #errorMsg;
  #value;

  constructor(value, errorMsg, isSuccess) {
    this.#value = value;
    this.#errorMsg = errorMsg;
    this.isSuccess = isSuccess; // Fixed typo from C# 'IsSucess'
  }

  get isFailure() {
    return !this.isSuccess;
  }

  get errorMsg() {
    if (this.isFailure) {
      return this.#errorMsg;
    }
    throw new Error("Cannot access errorMsg from a Success result.");
  }

  get value() {
    if (this.isSuccess) {
      return this.#value;
    }
    throw new Error("Cannot access value from a Failure result.");
  }

  // Factory methods
  static success(value = null) {
    return new Result(value, null, true);
  }

  static failure(errorMsg) {
    return new Result(null, errorMsg, false);
  }
}

module.exports = Result;