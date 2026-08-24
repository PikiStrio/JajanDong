import { prisma } from "../lib/prisma";

export const getMenus = async () => {
    return await prisma.menu.findMany({
        where: {
            deletedAt: null
        }
    });
};

export const getMenuById = async (id: number) => {
    return await prisma.menu.findUnique({
        where: {
            id,
            deletedAt: null
        }
    });
};

export const createMenu = async (name: string, description: string, price: number, image?: string) => {
    const imagePath = image ? `/uploads/menus/${image}` : null;

    return await prisma.menu.create({
        data: {
            name,
            description,
            price,
            image: imagePath
        }
    });
};

export const updateMenu = async (id: number, name: string, description: string, price: number, image?: string) => {
    const imagePath = image ? `/uploads/menus/${image}` : undefined;

    return await prisma.menu.update({
        where: {
            id,
            deletedAt: null
        },
        data: {
            name,
            description,
            price,
            ...(imagePath ? { image: imagePath } : {})
        }
    });
};

export const deleteMenu = async (id: number) => {
    return await prisma.menu.update({
        where: {
            id,
            deletedAt: null
        },
        data: {
            deletedAt: new Date()
        }
    });
};