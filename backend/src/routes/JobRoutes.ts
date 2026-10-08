import { Router } from "express";
import { createJob, getBySearch, getJob, listJobs } from "../controllers/JobController.js";

export const jobRoutes = Router();

jobRoutes.get('/jobs/get-all', listJobs);
jobRoutes.get('/jobs/:id', getJob);
jobRoutes.post('/companies/:id/jobs', createJob);
jobRoutes.get('/jobs/search/title=:title', getBySearch);
