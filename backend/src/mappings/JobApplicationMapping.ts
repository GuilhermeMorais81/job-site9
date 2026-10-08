import { EntitySchema } from "@mikro-orm/core";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { JobApplication } from "../models/JobApplication.js";

export const JobApplicationSchema = new EntitySchema<JobApplication>({
    class: JobApplication,
    tableName: 'jobApplication',
    properties: {
        applicant: {
            kind:'m:1',
            entity: () => User,
            fieldName:'applicantId',
            primary:true            
        },
        job: {
            kind: 'm:1',
            entity: () => Job,
            fieldName:'jobId',
            primary:true
        },
        cvData: {
            type: 'blob',
            fieldName:'cvData'
        },
        fileName: {
            type:'string',
            fieldName:'fileName'
        },
        mimeType: {
            type:'string',
            fieldName:'mimeType'
        }
    }
});