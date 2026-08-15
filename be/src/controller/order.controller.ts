import { Request, Response } from "express";
import * as orderService from "../services/order.service";

export const createOrder = async (req: Request, res: Response) => {
    try {

        const userId = req.user!.userId;

        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order harus memiliki item"
            });
        }

        const order = await orderService.createOrder(
            userId,
            items
        );

        res.status(201).json({
            success: true,
            data: order,
            message: "Order berhasil dibuat"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal membuat order"
        });
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;

        const orders = await orderService.getMyOrders(userId);

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get orders"
        });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const orderId = Number(req.params.id);

        const order = await orderService.getOrderById(
            orderId,
            userId
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal mendapatkan order"
        });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.id);

        const { status } = req.body;

        if (!["CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status tidak valid"
            });
        }

        const order = await orderService.updateOrderStatus(
            orderId,
            status
        );

        res.status(200).json({
            success: true,
            data: order,
            message: "Status order berhasil diubah"
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Gagal mengubah status order"
        });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await orderService.getAllOrders();

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal mendapatkan semua order"
        });
    }
};