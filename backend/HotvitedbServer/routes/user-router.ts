import express, {Request, Response} from "express";
import {check} from 'express-validator';
import {dbUtility} from "../utilities/db-utilities";
import {comparePassword, createUser, isValidNewUser} from "../logic/user-repo";
import {User} from "../models/user";
import {isAuthenticated} from "../middleware/auth-handler";
import jwt from "jsonwebtoken";
import {secret_key} from "../app";
import {AuthRequest} from "../models/authRequest";
import {StatusCodes} from "http-status-codes";

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
        const user: User = await createUser(req.body);

        if (!await isValidNewUser(user)) {
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({result: "user already exists"});
            return;
        }

        await dbUtility.saveUser(user);

        res.status(StatusCodes.CREATED).json({result: "user created"});
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

userRouter.post("/login", async (req :  Request, res : Response) => {
    try {
        const {email, password} = {email: req.body.email, password: req.body.password};

        if (!password || !email) {
            return res.status(StatusCodes.BAD_REQUEST).send("requiring <email, password>");
        }

        if (!secret_key) {
            return res.sendStatus(StatusCodes.UNAUTHORIZED);
        }

        const user = await dbUtility.getTableByValue<User>("user", "email", email);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).send("User not found");
        }

        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            return res.status(StatusCodes.BAD_REQUEST).send("Email or password not valid");
        }

        const userClaims = {
            email: email
        };

        const minutes = 45;
        const expiresAt = new Date(Date.now() + minutes * 60_000);

        const token = jwt.sign(
            {
                user: userClaims,
                exp: expiresAt.getTime() / 1000,
            },
            secret_key
        );

        res.status(StatusCodes.OK).json({token: token, username: user.username});
    } catch (error) {
        console.error("Error in login:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

userRouter.put("/changeUsername", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const payload = (req as AuthRequest).payload;
        const username = req.body.username;

        if (!username)
            return res.status(StatusCodes.BAD_REQUEST).send("need username as");

        await dbUtility.updateValueByRowInTableWithCondition("user"
            , "username"
            , username
            , "email"
            , payload.user.email);

        res.status(StatusCodes.OK).send("username changed");
    } catch (error) {
        console.error("Error in login:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

userRouter.delete("/delete", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;

        await dbUtility.deleteRowInTable("user", "email", payload.user.email);

        res.status(StatusCodes.OK).send("user deleted");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});