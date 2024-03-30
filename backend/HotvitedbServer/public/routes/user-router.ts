import {User} from "../model";
import express, {Request, Response} from "express";
import {check} from 'express-validator';
import {dbUtility} from "../utilities/db-utilities";
import {createUser, isValidUser} from "../logic/user-repo";

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
        const user: User = await createUser(req.body);

        if(!await isValidUser(user)){
            res.sendStatus(405);
            return;
        }

        await dbUtility.saveUser(user);

        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

