import { Router } from "express";
import { listJobs } from "../controllers/JobController.js";

export const jobRoutes = Router();

jobRoutes.get('/get-all', listJobs);