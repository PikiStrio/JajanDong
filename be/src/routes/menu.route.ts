import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.middleware";
import * as menuController from "../controller/menu.controller";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads", "menus");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const cleanName = (file.originalname || "menu")
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    cb(null, `${Date.now()}-${cleanName}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      return;
    }

    cb(new Error("Only image files are allowed"));
  },
});

router.get("/", authMiddleware, menuController.getMenus);
router.get("/:id", authMiddleware, menuController.getMenuById);
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), menuController.createMenu);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), menuController.updateMenu);
router.delete("/:id", authMiddleware, adminMiddleware, menuController.deleteMenu);

export default router;