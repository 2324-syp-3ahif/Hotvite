import express, {Request, Response} from "express";
import {check} from 'express-validator';
import {dbUtility} from "../utilities/db-utilities";
import {comparePassword, createUser, isValidNewUser} from "../logic/user-repo";
import {User} from "../models/user";
import {isAuthenticated} from "../middleware/auth-handler";
import jwt from "jsonwebtoken";
import {secret_key} from "../app";
import {AuthRequest} from "../models/authRequest";

export const userRouter = express.Router();

// Validation rules
const validateUserSignup = [
    check('username').isLength({min: 3}),
    check('email').isEmail(),
    check('password').isLength({min: 6}),
    check('aboutme').optional().isString(),
];

userRouter.post("/signup", validateUserSignup, async (req: Request, res: Response) => {
    try {
        if (!await isValidNewUser(req.body)) {
            res.sendStatus(405);
            return;
        }

        const user: User = await createUser(req.body);

        await dbUtility.saveUser(user);

        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

userRouter.post("/login", async (req :  Request, res : Response) => {
    try {
        const {email, password} = {email: req.body.email, password: req.body.password};

        if (!password || !email) {
            return res.status(400).send("requiring <email, password>");
        }

        if (!secret_key) {
            return res.sendStatus(500);
        }

        const user: User = (await dbUtility.getTableByValue("user", "email", email))[0];

        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            return res.status(400).send("email or password not valid");
        }

        const userClaims = {
            email: email
        };

        const minutes = 30;
        const expiresAt = new Date(Date.now() + minutes * 60_000);

        const token = jwt.sign(
            {
                user: userClaims,
                exp: expiresAt.getTime() / 1000,
            },
            secret_key
        );

        res.status(200).json({token: token, username: user.username});
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

userRouter.put("/changeUsername", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const payload = (req as AuthRequest).payload;
        const username = req.body.username;

        if (!username)
            return res.status(400).send("need username as");

        await dbUtility.updateValueByRowInTableWithCondition("user"
            , "username"
            , username
            , "email"
            , payload.user.email);

        res.status(200).send("username changed");
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

userRouter.delete("/delete", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;

        await dbUtility.deleteRowInTable("user", "email", payload.user.email);

        res.status(204).send("user deleted");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({error: "Internal server error"});
    }
});