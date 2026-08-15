import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.ts";

export const registerUser = async (name: string, email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword, 
        },
    });

    return ;
}

export const getUser = async () => {
    const users = await prisma.user.findMany();
    return {
        users : users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        }))
    };
}

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid username or password");
    }

    const jwtToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "default",
        { expiresIn: "1h" }
    );

    return {
        existingUser: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
        token: jwtToken,
    };
}