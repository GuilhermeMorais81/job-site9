import { orm } from "../app.js";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { Result } from "../shared/Result.js";

export class JobApplicationValidators {
    private _userId : string;
    private _cv : Express.Multer.File
    private _jobId : string;

    constructor(userId : string, cv : Express.Multer.File, jobId : string) {
        this._userId = userId;
        this._cv = cv;
        this._jobId = jobId;
    }

    async isValidUser() : Promise<Result> {
        let user = await orm.em.findOne(User, {id : this._userId});
        if(user === null) return Result.failure("usuario não encontrado");
        return Result.success();
    }
    
    async isValidJob() : Promise<Result> {
        let job = await orm.em.findOne(Job, {id : this._jobId});
        if(job === null) return Result.failure("vaga não encontrada");
        return Result.success();
    }

    isValidFile() : Result {
        return !this._cv ?
         Result.failure("arquivo não recebido") : Result.success()
    }

    private validators : Array<() => Result | Promise<Result>> = [
        async () => this.isValidJob(),
        async () => this.isValidUser(),
        () => this.isValidFile()
    ]

    async isValidJobApplication() : Promise<Result> {
        for(let validator of this.validators) {
            let result = await validator();
            if(result.isFailure) return Result.failure(result.errorMsg!);
        }
        return Result.success();
    }
}