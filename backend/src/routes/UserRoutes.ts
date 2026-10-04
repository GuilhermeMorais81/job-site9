import { Router } from "express";
import { createUser, listUsers } from "../controllers/UserController.js";

const router = Router();

router.post('/', createUser);
router.get("/get-all", listUsers);

export default router;