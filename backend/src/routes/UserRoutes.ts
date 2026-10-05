import { Router } from "express";
import { createUser, listUsers, loginUser } from "../controllers/UserController.js";

export const userRoutes = Router();

userRoutes.post('/', createUser);
userRoutes.get("/get-all", listUsers);
userRoutes.post("/login", loginUser);
