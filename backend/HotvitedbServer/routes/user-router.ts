import express, {Request, Response} from "express";
import {check} from 'express-validator';
import {User} from "../dataModels/user";
import {isAuthenticated} from "../middleware/auth-handler";
import jwt from "jsonwebtoken";
import {secret_key} from "../app";
import {AuthRequest} from "../dataModels/authRequest";
import {StatusCodes} from "http-status-codes";
import {UserDto} from "../dataModels/userDto";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import {databaseManager} from "../databaseManager";

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
            res.status(StatusCodes.METHOD_NOT_ALLOWED).send("User already exists");
            return;
        }

        await databaseManager.saveUser(user);

        res.status(StatusCodes.CREATED).json({result: "user created"});
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

userRouter.get("/getMyDetails", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await databaseManager.getTableByValue<User>("user", "email", payload.user.email);

        if (!user) {
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        res.status(200).json({username: user.username, aboutme: user.aboutme, email: user.email});
    } catch (error) {
        console.error("Error in my getting details:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

userRouter.get("/getDetails/:id", async (req: Request, res: Response) => {
    try {
        const user = await databaseManager.getTableByValue<User>("user", "id", req.params.id);

        if (!user) {
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        res.status(200).json({username: user.username, aboutme: user.aboutme, email: user.email});
    } catch (error) {
        console.error("Error in getting details:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});


userRouter.post("/login", async (req :  Request, res : Response) => {
    try {
        const {email, password} = {email: req.body.email, password: req.body.password};

        if (!password || !email) {
            return res.status(StatusCodes.BAD_REQUEST).send("Requiring <email, password>");
        }

        if (!secret_key) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server could not process request. Please try again later.");
        }

        const user = await databaseManager.getTableByValue<User>("user", "email", email);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).send("User does not exist");
        }

        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid password");
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

        await databaseManager.updateValueByRowInTableWithCondition("user"
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

        await databaseManager.deleteRowInTable("user", "email", payload.user.email);

        res.status(StatusCodes.OK).send("user deleted");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

export async function createUser(user: UserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return {
        id: uuidv4(),
        username: user.username,
        email: user.email,
        password: hashedPassword,
        aboutme: user.about_me,
    };
}

async function isValidNewUser(user: User): Promise<boolean> {
    //check if the email is already in use

    return !(await databaseManager.hasEntryInColumnInTable("user", "email", user.email));
}

async function comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}
