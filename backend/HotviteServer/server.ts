import express, {Request, Response, NextFunction} from "express";
import {mapRouter} from "./routes/map-router";
import cors from "cors";

const server = express();

// Options
server.use(cors());
server.use(express.json());

// Routes
server.use("/api/v1/map/", mapRouter);

server.listen(3001);

server.get("/", (req: any, res: any) => {
    res.send(200).send("Server online");
});
