import {User} from "../model";
import {v4 as uuidv4} from "uuid";
import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';
import {check} from 'express-validator';

export const userRouter = express.Router();

// Validation rules
const validateUser = [
    check('username').isLength({min: 3}),
    check('email').isEmail(),
    check('password').isLength({min: 6}),
    check('aboutme').optional().isString(),
];

userRouter.post("/create", validateUser, async (req: Request, res: Response) => {
    try {
        const {username, email, password, aboutme} = req.body;

        // add salt to the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user: User = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            aboutme,
        };

        //TODO: Save user to the database

        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({error: "Internal server error"});
    }
});
