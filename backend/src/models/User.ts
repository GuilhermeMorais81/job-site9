import { Collection } from "@mikro-orm/core";
import { randomUUID, type UUID } from "node:crypto";
import { Job } from "./Job.js";
import { JobApplication } from "./JobApplication.js";

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
}

