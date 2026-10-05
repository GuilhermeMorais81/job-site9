import { Router } from "express";
import { createUser, listUsers, loginUser } from "../controllers/UserController.js";

const router = Router();

router.post('/', createUser);
router.get("/get-all", listUsers);
router.post("/login", loginUser);

export default router;