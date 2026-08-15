import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import * as menuController from "../controller/menu.controller";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.get("/", authMiddleware, menuController.getMenus);
router.get("/:id", authMiddleware, menuController.getMenuById);
router.post("/", authMiddleware,adminMiddleware, menuController.createMenu);
router.put("/:id", authMiddleware,adminMiddleware, menuController.updateMenu);
router.delete("/:id", authMiddleware,adminMiddleware, menuController.deleteMenu);

export default router;