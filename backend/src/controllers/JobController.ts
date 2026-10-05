import type { Request, Response } from "express";
import { orm } from "../app.js";
import { Job } from "../models/Job.js";

export const listJobs = async (
    req : Request,
    res : Response
) => {
    const list = await orm.em.find(
        Job,
        {active: true}, 
        {
            fields: ['title', 'createdAt', 'company.name'],
            populate: ['company'],
            orderBy: {
                createdAt:'DESC'
            },
            limit: 20,
        }
    )
    res.status(200).json(Job.toJobSummaries(list as Job[]));
}