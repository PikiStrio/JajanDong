import { OrderStatus } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const createOrder = async (userId: number,items: { menuId: number; quantity: number; }[]) => {
    const menus = await prisma.menu.findMany({
        where: {
            id: {
                in: items.map(item => item.menuId)
            }
        }
    });

    let total = 0;

    const orderItems = items.map(item => {
        const menu = menus.find(menu => menu.id === item.menuId);

        if (!menu) {
            throw new Error(`Menu ${item.menuId} tidak ditemukan`);
        }

        const itemTotal = menu.price * item.quantity;

        total += itemTotal;

        return {
            menuId: menu.id,
            quantity: item.quantity,
            price: menu.price
        };
    });

    const order = await prisma.order.create({
        data: {
            userId,
            total,
            items: {
                create: orderItems
            }
        },
        include: {
            items: {
                include: {
                    menu: true
                }
            }
        }
    });

    return order;
};

export const getMyOrders = async (userId: number) => {

    return await prisma.order.findMany({
        where: {
            userId
        },
        include: {
            items: {
                include: {
                    menu: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const getOrderById = async (orderId: number, userId: number) => {
    return await prisma.order.findFirst({
        where: {
            id: orderId,
            userId
        },
        include: {
            items: {
                include: {
                    menu: true
                }
            }
        }
    });
};

export const updateOrderStatus = async (orderId: number, status: OrderStatus) => {

    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
        }
    });

    if (!order) {
        throw new Error("Order tidak ditemukan");
    }

    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
        throw new Error(
            `Order yang sudah ${order.status} tidak dapat diubah`
        );
    }

    const updatedOrder = await prisma.order.update({
        where: {
            id: orderId
        },
        data: {
            status
        },
        include: {
            items: {
                include: {
                    menu: true
                }
            }
        }
    });

    return updatedOrder;
};

export const getAllOrders = async () => {
    return await prisma.order.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            items: {
                include: {
                    menu: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};