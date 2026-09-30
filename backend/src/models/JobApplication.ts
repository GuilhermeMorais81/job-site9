import type { Job } from "./Job.js";
import type { User } from "./User.js";

export class JobApplication {
    job: Job;
    applicant: User;
    curriculumVitae : File;


    constructor(job : Job, applicant : User, curriculumVitae : File) {
        this.job = job;
        this.applicant = applicant;
        this.curriculumVitae = curriculumVitae;
    }
}