import {NextFunction, Request, Response} from "express";
import {AuthRequest} from "../models/authRequest";

export const adminHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = (req as AuthRequest).payload;

        if (payload.user.role === "admin") {
            next();
        } else {
            res.status(401).send("Admin role required");
        }

        next();
    } catch (err) {
        res.status(401).send(`Please authenticate! ${err}`);
    }
};