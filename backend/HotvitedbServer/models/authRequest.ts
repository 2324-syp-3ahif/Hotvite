import {Request} from "express";
import {JwtPayload} from "jsonwebtoken";

export interface AuthRequest extends Request {
    payload: {user: {email: string, role: string}}
}