import type { Request, Response } from "express";
import { orm } from "../app.js";
import { Job } from "../models/Job.js";
import type { JobCreation } from "../interfaces/JobCreation.js";
import { title } from "node:process";

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

export const getJob = async (
    req : Request<{id :string},{},{}>,
    res : Response
) => {
    const job = await orm.em.findOne(
        Job, 
        {id:req.params.id},
        {fields:['id', 'company.name','title','description','salary','createdAt']}
    );
    if(job === null) 
        return res.status(404).json({message: "vaga não encontrada"});
    res.status(200).json(job);
}

export const getBySearch = async (
    req : Request<{title : string},{},{}>,
    res : Response
) => {
    if(!req.params.title)
        return res.status(400).json({message: "pesquisa vazia"});
    const list = await orm.em.find(
        Job,
        {active: true, title: {$like:`%${req.params.title}%`}}, 
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