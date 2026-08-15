import { Request, Response } from "express";
import * as menuService from "../services/menu.service";

export const getMenus = async (req: Request, res: Response) => {
    try {
        const menus = await menuService.getMenus();
        res.status(200).json({
            success: true,
            data: menus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get menus"
        });
    }
};

export const getMenuById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const menu = await menuService.getMenuById(id);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found"
            });
        }

        res.status(200).json({
            success: true,
            data: menu
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get menu"
        });
    }
};

export const createMenu = async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;

        const menu = await menuService.createMenu(
            name,
            description,
            price
        );

        res.status(201).json({
            success: true,
            data: menu,
            message: "Menu created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create menu"
        });
    }
};

export const updateMenu = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const { name, description, price } = req.body;

        const menu = await menuService.updateMenu(
            id,
            name,
            description,
            price
        );

        res.status(200).json({
            success: true,
            data: menu,
            message: "Menu updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update menu"
        });
    }
};

export const deleteMenu = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        await menuService.deleteMenu(id);

        res.status(200).json({
            success: true,
            message: "Menu deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete menu"
        });
    }
};
