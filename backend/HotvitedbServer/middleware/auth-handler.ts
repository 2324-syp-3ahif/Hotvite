import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {secret_key} from "../app";
import {AuthRequest} from "../models/authRequest";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');


        if (!token) {
            return res.sendStatus(401);
        }

        if (!secret_key) {
            return res.sendStatus(500);
        }

        let decoded = jwt.verify(token, secret_key);

        (req as AuthRequest).payload = decoded as { user: { email: string, role: string } }

        next();
    } catch (err) {
        res.status(401).send(`Please authenticate! ${err}`);
    }
};