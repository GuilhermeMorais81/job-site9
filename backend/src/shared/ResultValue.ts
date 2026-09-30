import { Result } from "./Result";

export class ResultValue<T> extends Result {
    private _value : T;

    private constructor(isSuccess: boolean, errorMsg: string | undefined, value : T) {
        super(isSuccess, errorMsg);
        this._value = value;
    }

    get value() : T {
        if(this.isFailure) 
            throw new Error("Nao e possivel acessar o value de um resultado falso");
        return this._value;
    }

    static successWithValue<T>(value : T) : ResultValue<T> {
        return new ResultValue<T>(true, undefined, value);
    }   

    static failure<T>(errorMsg : string) : ResultValue<T> {
        return new ResultValue<T>(false, errorMsg, undefined!);
    }
}