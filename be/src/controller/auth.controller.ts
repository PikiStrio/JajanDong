import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const user = await authService.registerUser(req.body.name, req.body.email, req.body.password);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(409).json({
                success: false,
                message: error.message
            })
        }
        res.status(500).json({ 
            success: false,
            message: "Failed to register user" 
        });
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const users = await authService.getUser();
        res.status(200).json({
            success: true,
            data: users,
            message: "Users fetched successfully",
        })
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch users" 
        });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
    const { existingUser, token } = await authService.loginUser(req.body.email, req.body.password);
        
    res.status(200).json({
        success: true,
        data: {
            user: existingUser,          
            token: token,
        },
            message: "User logged in successfully",
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({
                success: false,
                message: error.message
            })
        }
        res.status(500).json({
            success: false,
            message: "Failed to login user" 
        });
    }
}