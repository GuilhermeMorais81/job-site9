export class Result {
  readonly isSuccess: boolean;
  private readonly _errorMsg : string | undefined;

  protected constructor(isSuccess: boolean, errorMsg : string | undefined) {
    this.isSuccess = isSuccess;
    this._errorMsg = errorMsg;
  }

  get isFailure(): boolean {
    return !this.isSuccess;
  }

  get errorMsg() {
    if (this.isSuccess) {
      throw new Error("nao e possivel acessar o errorMsg de um resultado verdadeiro.");
    }
    return this._errorMsg;
  }

  static success() {
    return new Result(true, undefined);
  }

  static failure(errorMsg : string) {
    return new Result(false, errorMsg);
  }
}