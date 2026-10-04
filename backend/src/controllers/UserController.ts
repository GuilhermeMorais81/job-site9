import type { Request, Response } from "express";
import type { UserCreationReq } from "../interfaces/UserCreationReq.js";
import { User } from "../models/User.js";
import { RequestContext } from "@mikro-orm/core";
import { orm } from "../app.js";

export const createUser = async (
    req : Request<{}, {}, UserCreationReq>,
     res : Response
) => {
    const creation = await User.create(req.body);
    if (creation.isFailure) 
        return res.status(400).json({message: creation.errorMsg});
    orm.em.persist(creation.value);
    orm.em.flush();
    res.status(200).json(creation.value);    
}

export const listUsers = async (
    req : Request,
     res : Response
) => {
    const list = await orm.em.findAll(User);
    return res.json(list);
}