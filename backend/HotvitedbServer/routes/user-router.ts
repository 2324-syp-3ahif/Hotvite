import express, {Request, Response} from "express";
import {check} from 'express-validator';
import {dbUtility} from "../utilities/db-utilities";
import {createUser, isValidNewUser, isValidRequestByUser} from "../logic/user-repo";
import {User} from "../models/user";
import {isAuthenticated} from "../middleware/auth-handler";
import jwt from "jsonwebtoken";
import {secret_key} from "../dbserver";

export const userRouter = express.Router();

// Validation rules
const validateUserSignup = [
    check('username').isLength({min: 3}),
    check('email').isEmail(),
    check('password').isLength({min: 6}),
    check('aboutme').optional().isString(),
];

const validateUsernameAndPassword = [
    check('username').isLength({min: 3}),
    check('password').isLength({min: 6}),
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
    const {username, email} = {username: req.body.username, email: req.body.email};

    if(secret_key){
        return res.status(500);
    }

    const userClaims = {
        email: email,
        role: username,
    };
    const minutes = 15;
    const expiresAt = new Date(Date.now() + minutes * 60);

    const token = jwt.sign(
        {
            user: userClaims,
            exp: expiresAt.getTime(),
        },
        secret_key
    );

    res.json(token);
});

userRouter.put("/changeUsername/:id", validateUsernameAndPassword, isAuthenticated, async (req: Request, res: Response) => {
    const {password, username, id} = {
        password: req.body.password,
        username: req.body.username,
        id: req.params.id,
    };

    const result = await isValidRequestByUser(id, password);

    if (typeof result === "string") {

        return res.status(403).send(result);
    }

    await dbUtility.updateValueByRowInTableWithCondition("user"
        , "username"
        , username
        , "id"
        , id);


    res.status(200).send("username changed");
});

userRouter.delete("/delete/:id", async (req, res) => {
    const {id, password} = {id: req.params.id, password: req.body.password};

    const result = await isValidRequestByUser(id, password);

    if (typeof result === "string") {
        return res.status(403).send(result);;
    }

    await dbUtility.deleteRowInTable("user", "id", id);

    res.status(204).send("user deleted");
});