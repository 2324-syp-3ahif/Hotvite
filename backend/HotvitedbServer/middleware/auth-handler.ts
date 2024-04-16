import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import {secret_key} from "../dbserver";
import {AuthRequest} from "../models/authRequest";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401);
        }

        if (secret_key) {
            console.error("secret key not defined");
            return res.status(500);
        }

        let decoded = jwt.verify(token, secret_key);

        (req as AuthRequest).payload = decoded as JwtPayload;

        next();
    } catch (err) {
        res.status(401).send(`Please authenticate! ${err}`);
    }
};