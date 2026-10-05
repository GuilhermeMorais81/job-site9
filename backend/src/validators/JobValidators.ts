import { User } from "../models/User.js";
import { Result } from "../shared/Result.js";
import { UniversalValidators } from "./UniversalValidators.js";

export class JobValidators {
    isValidCompany(user : User) : Result {
        return user.isCompany ?
            Result.success() : Result.failure("Usuario deve ser uma empresa");
    }

    isValidTitle(title : string) : Result {
        return UniversalValidators.isValidStringlength(title, 3, 160) ?
            Result.success() : Result.failure("Titulo possui tamanho invalido");
    } 

    isValidDescription(description : string | null) : Result {
        if(description === null) return Result.success();
        else return UniversalValidators.isValidStringlength(description, 0, 2000) ?
            Result.success() : Result.failure("Descrição excede o numero maximo de caracteres");
    }

    isValidSalary(salary : number) : Result {
        return salary >= 0 && salary <= 1000000 ?
            Result.success() : Result.failure("salario possui valor invalido");
    }
}