import { randomUUID } from "node:crypto";
import { User } from "./User.js";
import { Collection } from "@mikro-orm/core";
import { JobApplication } from "./JobApplication.js";
import type { JobSummary } from "../interfaces/JobSummary.js";
import type { JobCreation } from "../interfaces/JobCreation.js";
import { ResultValue } from "../shared/ResultValue.js";
import { JobValidators } from "../validators/JobValidators.js";
import { orm } from "../app.js";

export class Job {
    company! : User
    id : string;
    title : string;
    description : string | null;
    salary : number;
    active : boolean;
    createdAt : Date;
    jobApplications : Collection<JobApplication>;

    constructor(companyId : string, title : string, description : string, salary : number) {
        this.company = orm.em.getReference(User, companyId);
        this.id = randomUUID();
        this.title = title;
        this.description = description;
        this.salary = salary;
        this.active = true;
        this.createdAt = new Date();
        this.jobApplications = new Collection<JobApplication>(this);
    }

    static async create(jobReq : JobCreation, companyId : string) : Promise<ResultValue<Job>> {
        let jobValidator = new JobValidators(jobReq, companyId);
        let result = await jobValidator.isValidJob();
        if(result.isFailure)
            return ResultValue.failure(result.errorMsg!);
        return ResultValue.successWithValue(this.toEntity(jobReq, companyId));
    }

    static toEntity(job : JobCreation, companyId : string) :Job {
        return new Job(
            companyId,
            job.title,
            job.description!,
            job.salary
        )
    }

    toJobSummary() : JobSummary {
        return {
            id: this.id,
            title: this.title,
            createdAt: this.createdAt,
            company: this.company.name
        }
    }

    static toJobSummaries(list : Job[]) : JobSummary[] {
        let jobSummaries  = [];
        for(let job of list) 
            jobSummaries.push(job.toJobSummary());
        return jobSummaries;
    }
}


