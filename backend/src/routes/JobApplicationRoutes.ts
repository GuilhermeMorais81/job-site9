import { Router } from "express";
import { addJobApplication, listJobApplications } from "../controllers/JobApplicationControllers.js";
import { upload } from "../multer.js";


export const jobApplicationRoutes = Router();

jobApplicationRoutes.post('/jobs/:jobId/newJobApplication', upload.single('file'), addJobApplication);
jobApplicationRoutes.get('/companies/:companyId/jobs/:jobId/jobApplications', listJobApplications)