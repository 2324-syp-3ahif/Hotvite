import {User} from "../model";
import express, {Request, Response} from "express";
import {check} from 'express-validator';
import {dbUtility} from "../utilities/db-utilities";
import {createUser, isValidNewUser, isValidRequestByUser} from "../logic/user-repo";

export const userRouter = express.Router();

// Validation rules
const validateUserSignup = [
    check('username').isLength({min: 3}),
    check('email').isEmail(),
    check('password').isLength({min: 6}),
    check('aboutme').optional().isString(),
];

const validateUserChangeUsername = [
    check('username').isLength({min: 3}),
    check('password').isLength({min: 6}),
];
userRouter.post("/signup", validateUserSignup, async (req: Request, res: Response) => {
    try {
        const user: User = await createUser(req.body);

        if (!await isValidNewUser(user)) {
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

userRouter.put("/changeUsername/:id", validateUserChangeUsername, async (req: Request, res: Response) => {
    const {password, username, id} = {
        password: req.body.password,
        username: req.body.username,
        id: req.params.id,
    };

    const result = await isValidRequestByUser(id, password);

    if (typeof result === "string") {
        res.status(403).send(result);
        return;
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
        res.status(403).send(result);
        return;
    }

    await dbUtility.deleteRowInTable("user", "id", id);

    res.status(204).send("user deleted");
});