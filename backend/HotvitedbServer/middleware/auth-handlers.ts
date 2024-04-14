import express, {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {secret_key} from "../dbserver";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token || secret_key) {
            return res.status(401);
        }

        jwt.verify(token, secret_key);
        next();
    } catch (err) {
        res.status(401).send(`Please authenticate! ${err}`);
    }
};