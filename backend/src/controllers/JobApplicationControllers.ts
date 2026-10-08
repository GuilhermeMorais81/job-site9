import type { Request, Response } from "express";
import { JobApplication } from "../models/JobApplication.js";
import { orm } from "../app.js";
import { JobApplicationSchema } from "../mappings/JobApplicationMapping.js";
import { User } from "../models/User.js";

export const addJobApplication =  async (
    req : Request<{ jobId : string}, {}, {userId : string}>,
    res : Response
) => {
    let creation = await JobApplication.create(
        req.params.jobId,
        req.body.userId,
        req.file!
    );
    if(creation.isFailure)
        return res.status(400).json({message: creation.errorMsg});
    orm.em.persist(creation.value);
    orm.em.flush();
    res.status(204).end();
}

export const listJobApplications = async (
    req : Request<{companyId : string, jobId : string}, {}, {}>,
    res : Response
) => {
    if(await orm.em.findOne(User, {id:req.params.companyId, isCompany:true}) === null)
        res.status(200).json({message: "Empresa criadora da vaga não encontrada"});
    let list = await orm.em.find(
        JobApplicationSchema, 
        {job: req.params.jobId},
        {fields:['applicant.name']}
    );
    res.status(200).json(list);
}

export const loadJobApplication = async (
    req : Request<{companyId : string, jobId : string, applicantId : string}, {}, {}>,
    res : Response
) => {
    const jobApplication = await orm.em.findOne(
        JobApplicationSchema, 
        {job: req.params.jobId, applicant: req.params.applicantId}
    );
    if(jobApplication === null) 
        return res.status(400).json({message: "aplicação de vaga não encontrada"});
    res.setHeader('Content-Type', jobApplication.mimeType);
    res.setHeader('Content-Disposition',
    `inline; filename="${jobApplication.fileName}"`);
    return res.send(jobApplication.cvData);
}