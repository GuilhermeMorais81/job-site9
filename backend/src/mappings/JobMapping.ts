import { EntitySchema } from "@mikro-orm/core";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { JobApplication } from "../models/JobApplication.js";

export const JobSchema = new EntitySchema<Job>({
    class: Job,
    tableName:'job',
    properties: {
        company: {
            kind:'m:1',
            entity: () => User,
            fieldName: 'companyId',
            deleteRule: 'cascade',
            nullable: false
        },
        id: {
            type:'uuid',
            primary:true,
            fieldName:'id'
        },
        title: {
            type:'string',
            fieldName:'title',
        },
        description: {
            type:'string',
            fieldName:'description',
            nullable: true
        },
        salary: {
            type:'numeric',
            fieldName:'salary'
        },
        active: {
            type:'boolean',
            fieldName:'active'
        },
        createdAt: {
            type:'date',
            fieldName:'createdAt'
        },
        jobApplications:  {
            kind:'1:m',
            entity: () => JobApplication,
            mappedBy: (jobApplication) => jobApplication.job
        }
    }
})