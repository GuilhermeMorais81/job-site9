import { EntitySchema } from "@mikro-orm/core";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { JobApplication } from "../models/JobApplication.js";

export const UserSchema = new EntitySchema<User>({
    class: User,
    tableName: 'user',

    properties: {
        id: {
            type:'uuid',
            primary: true,
            fieldName:'id'
        },
        name: {
            type:'string',
            fieldName:'name',
        },
        email: {
            type:'string',
            fieldName:'email'
        },
        passwordHash: {
            type:'string',
            fieldName:'passwordHash'
        },
        isCompany: {
            type:'boolean',
            fieldName:'isCompany'
        },
        jobs: {
            kind:'1:m',
            entity: () => Job,
            mappedBy: (job) => job.company
        },
        jobApplications: {
            kind:'1:m',
            entity: () => JobApplication,
            mappedBy: (jobApplication) => jobApplication.applicant
        }
    }
})