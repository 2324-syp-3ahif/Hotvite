import {User} from "../model";
import {v4 as uuidv4} from "uuid";
import express, {Request, Response} from "express";
import bcrypt from 'bcrypt';
import {check} from 'express-validator';
import {dbUtility} from "../utilities/db-utilities";
import {METHOD_NOT_ALLOWED} from "http-status-codes";

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

        //check if the email is already in use
        const  result = await dbUtility.getUserByEmail(email);

        if(Array.isArray(result) && result.length >= 1){
            res.sendStatus(405);
            return;
        }

        // add salt to the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user: User = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            aboutme,
        };

        await dbUtility.saveUser(user);

        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({error: "Internal server error"});
    }
});
