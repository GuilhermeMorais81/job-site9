import { Router } from "express";
import { createJob, listJobs } from "../controllers/JobController.js";

export const jobRoutes = Router();

jobRoutes.get('/get-all', listJobs);
jobRoutes.post('/:id/jobs', createJob);