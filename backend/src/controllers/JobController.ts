import type { Request, Response } from "express";
import { orm } from "../app.js";
import { Job } from "../models/Job.js";
import type { JobCreation } from "../interfaces/JobCreation.js";

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

export const createJob = async (
    req : Request<{ id : string }, {}, JobCreation>,
    res : Response
) => {
    const creation = await Job.create(req.body, req.params.id);
    if(creation.isFailure)
        res.status(400).json({message: creation.errorMsg});
    orm.em.persist(creation.value);
    orm.em.flush();
    res.status(200).json(creation.value);
}