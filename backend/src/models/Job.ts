import { randomUUID } from "node:crypto";
import type { User } from "./User.js";
import { Collection } from "@mikro-orm/core";
import { JobApplication } from "./JobApplication.js";
import type { JobSummary } from "../interfaces/JobSummary.js";

export class Job {
    company! : User
    id : string;
    title : string;
    description : string;
    salary : number;
    active : boolean;
    createdAt : Date;
    jobApplications : Collection<JobApplication>;

    constructor(user : User, title : string, description : string, salary : number) {
        this.company = user;
        this.id = randomUUID();
        this.title = title;
        this.description = description;
        this.salary = salary;
        this.active = true;
        this.createdAt = new Date();
        this.jobApplications = new Collection<JobApplication>(this);
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


