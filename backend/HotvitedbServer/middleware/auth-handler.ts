import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {secret_key} from "../app";
import {AuthRequest} from "../models/authRequest";
import {StatusCodes} from "http-status-codes";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');


        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).send('Please authenticate!');
        }

        if (!secret_key) {
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        let decoded = jwt.verify(token, secret_key);

        (req as AuthRequest).payload = decoded as { user: { email: string, role: string } }

        next();
    } catch (err) {
        res.status(401).send(`Please authenticate! ${err}`);
    }
};