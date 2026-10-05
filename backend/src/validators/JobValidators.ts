import { orm } from "../app.js";
import type { JobCreation } from "../interfaces/JobCreation.js";
import { User } from "../models/User.js";
import { Result } from "../shared/Result.js";
import { UniversalValidators } from "./UniversalValidators.js";

export class JobValidators {
    private _job : JobCreation;
    private _companyId : string;

    constructor(job : JobCreation, companyId : string) {
        this._job = job;
        this._companyId = companyId;
    }

    async isValidCompany(companyId : string) : Promise<Result> {
        let company = await orm.em.findOne(User, {id:companyId});
        if(company === null) return Result.failure("empresa não encontrada");
        return company.isCompany ? Result.success() : Result.failure("usuario não é uma empresa");
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

    private validators : Array<() => Result | Promise<Result>> = [
        async () => this.isValidCompany(this._companyId),
        () => this.isValidTitle(this._job.title),
        () => this.isValidDescription(this._job.description),
        () => this.isValidSalary(this._job.salary)
    ]

    async isValidJob() : Promise<Result> {
        for(let validator of this.validators) {
            let result = await validator();
            if(result.isFailure) return Result.failure(result.errorMsg!);
        }
        return Result.success();
    }
}