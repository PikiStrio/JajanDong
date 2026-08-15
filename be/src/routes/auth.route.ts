import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import * as authController from "../controller/auth.controller";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/users", authMiddleware,adminMiddleware, authController.getUser);


export default router;