import { Result } from "../shared/Result.js";
import { UniversalValidators } from "./UniversalValidators.js";

export class UserValidator {
    isValidEmail(email : string) : Result {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email.trim()) ? 
            Result.success() : Result.failure("O email é invalido");
    }

    isValidName(name : string) : Result {
        return UniversalValidators.isValidStringlength(name, 3, 100) ? 
            Result.success() : Result.failure("O nome possui tamanho invalido");
    }

    isValidPassword(password : string) : Result {
        return UniversalValidators.isValidStringlength(password, 6, 30) ? 
            Result.success() : Result.failure("A senha possui tamanho invalido");
    }
}