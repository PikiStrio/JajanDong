import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import * as menuController from "../controller/menu.controller";
import { adminMiddleware } from "../middleware/admin.middleware";
import multer from 'multer';


const router = Router();

const upload = multer({ dest: 'uploads/' });

router.get("/", authMiddleware, menuController.getMenus);
router.get("/:id", authMiddleware, menuController.getMenuById);
router.post("/", authMiddleware,adminMiddleware,upload.single("image"),menuController.createMenu);
router.put("/:id", authMiddleware,adminMiddleware, menuController.updateMenu);
router.delete("/:id", authMiddleware,adminMiddleware, menuController.deleteMenu);

export default router;