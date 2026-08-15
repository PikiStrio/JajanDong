import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import * as orderController from "../controller/order.controller";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.post("/", authMiddleware, orderController.createOrder);
router.get("/", authMiddleware, orderController.getMyOrders);
router.get("/admin/all", authMiddleware, adminMiddleware, orderController.getAllOrders);
router.get("/:id", authMiddleware, orderController.getOrderById);
router.patch("/:id/status", authMiddleware,adminMiddleware, orderController.updateOrderStatus);

export default router;