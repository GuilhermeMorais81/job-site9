import { orm } from "../app.js";
import type { UserCreationReq } from "../interfaces/UserCreationReq.js";
import { User } from "../models/User.js";
import { Result } from "../shared/Result.js";
import { UniversalValidators } from "./UniversalValidators.js";

export class UserValidator {
    private _user : UserCreationReq;

    constructor(user : UserCreationReq) {
        this._user = user;
    }

    async isValidEmail(email : string) : Promise<Result> {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email.trim()))
            return Result.failure("Formato invalido de email");
        if(await orm.em.findOne(User, { email: email}) !== null) 
            return Result.failure("Esse email já está sendo usado");
        return Result.success();
    }

    isValidName(name : string) : Result {
        return UniversalValidators.isValidStringlength(name, 3, 100) ? 
            Result.success() : Result.failure("O nome possui tamanho invalido");
    }

    isValidPassword(password : string) : Result {
        return UniversalValidators.isValidStringlength(password, 6, 30) ? 
            Result.success() : Result.failure("A senha possui tamanho invalido");
    }

    private _validators : Array<() => Result | Promise<Result>> = [
        async () => this.isValidEmail(this._user.email),
        () => this.isValidName(this._user.name),
        () => this.isValidPassword(this._user.password)
    ]

    async isValidUser() : Promise<Result> {
        for(let validator of this._validators) {
            let result = await validator();
            if(result.isFailure) return Result.failure(result.errorMsg!);
        }
        return Result.success();
    }
    

}