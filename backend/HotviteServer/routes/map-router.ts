import express from "express";
import * as fs from "fs";
import {StatusCodes} from "http-status-codes";

export const mapRouter = express.Router();

mapRouter.get("/style", (req, res) => {
    res.status(StatusCodes.OK).send(fs.readFileSync("data/mapsformat.json", "utf8"));
});