import express, {Request, Response, NextFunction} from "express";
import {mapRouter} from "./routes/map-router";
import cors from "cors";

const server = express();

// Options
server.use(cors());
server.use(express.json());

// Routes
server.use("/api/map/", mapRouter);

server.listen(3001, () => {
    console.log("http://localhost:3001/");
});
server.get("/", (req: any, res: any) => {
    res.send("Server online");
});
