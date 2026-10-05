import type { Request, Response } from "express";
import type { UserCreationReq } from "../interfaces/UserCreationReq.js";
import { User } from "../models/User.js";
import { RequestContext } from "@mikro-orm/core";
import { orm } from "../app.js";
import type { UserLogin } from "../interfaces/UserLogin.js";
import { verify } from "argon2";

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

export const loginUser = async (
    req : Request<{}, {}, UserLogin>,
    res: Response
) => {
    const user : User | null = await orm.em.findOne(User, {email: req.body.email});
    if(user === null)
        return res.status(400).json({message: "Email ou senha incorretos"});
    if(await verify(user.passwordHash, req.body.password))
        res.status(200).json(user.toUserLoginRes());
    else 
        res.status(400).json({message: "Email ou senha incorretos"});
}