import { Router } from "express";
import { createJob, listJobs } from "../controllers/JobController.js";

export const jobRoutes = Router();

jobRoutes.get('/jobs/get-all', listJobs);
jobRoutes.post('/companies/:id/jobs', createJob);
