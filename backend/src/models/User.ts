import { Collection } from "@mikro-orm/core";
import { randomUUID, type UUID } from "node:crypto";
import { Job } from "./Job.js";
import { JobApplication } from "./JobApplication.js";
import type { UserCreationReq } from "../interfaces/UserCreationReq.js";
import { ResultValue } from "../shared/ResultValue.js";
import { UserValidator } from "../validators/UserValidators.js";
import { hash } from "argon2";

export class User {
    id : string;
    name : string;
    email: string;
    passwordHash : string;
    isCompany : boolean;
    jobs : Collection<Job> | null;
    jobApplications: Collection<JobApplication> | null;

    constructor(name : string, email : string, passwordHash : string, isCompany : boolean) {
        this.id = randomUUID();
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.isCompany = isCompany;
        this.jobs = isCompany ? new Collection<Job>(this) : null;
        this.jobApplications = !isCompany ? new Collection<JobApplication>(this) : null;
    }

    static async create(userReq : UserCreationReq) : Promise<ResultValue<User>> {
        let userValidator = new UserValidator(userReq);
        let result = await userValidator.isValidUser();
        if(result.isSuccess) {
            let user = await this.toEntity(userReq);
            return ResultValue.successWithValue(user);  
        }
        else 
            return ResultValue.failure(result.errorMsg!);
    }

    static async toEntity(user : UserCreationReq) : Promise<User> {
        let passwordHash = await hash(user.password);
        return new User(user.name, user.email, passwordHash, user.isCompany);
    }

}

