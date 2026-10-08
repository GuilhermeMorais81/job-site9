import { orm } from "../app.js";
import { ResultValue } from "../shared/ResultValue.js";
import { JobApplicationValidators } from "../validators/JobApplicationValidators.js";
import { Job } from "./Job.js";
import { User } from "./User.js";

export class JobApplication {
    job: Job;
    applicant: User;
    cvData : Buffer;
    fileName : string;
    mimeType : string;


    constructor(jobId : string, applicantId : string, curriculumVitae : Express.Multer.File) {
        this.job = orm.em.getReference(Job, jobId);
        this.applicant = orm.em.getReference(User, applicantId);
        this.cvData = curriculumVitae.buffer;
        this.fileName = curriculumVitae.originalname;
        this.mimeType = curriculumVitae.mimetype;
    }

    static async create(jobId : string, userId : string, cv : Express.Multer.File) : Promise<ResultValue<JobApplication>> {
        let jobAppValidator = new JobApplicationValidators(userId, cv, jobId);
        let result = await jobAppValidator.isValidJobApplication();
        if(result.isFailure)
            return ResultValue.failure(result.errorMsg!);
        return ResultValue.successWithValue(this.toEntity(jobId, userId, cv));
    }

    static toEntity(jobId : string, userId : string, cv : Express.Multer.File) : JobApplication {
        return new JobApplication(
            jobId,
            userId,
            cv
        )
    }


}