import express from "express";
import {Event} from "../model"
import {createEvent, isValidEvent} from "../logic/event-repo";
import {dbUtility} from "../utilities/db-utilities";

export const eventRouter = express.Router();

eventRouter.post("/create", async (req, res) => {
    try {
        const event: Event = createEvent(req.body);

        if(!await isValidEvent(event)){
            res.sendStatus(405);
            return;
        }

        await dbUtility.saveEvent(event);

        res.status(201).json(event);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({error: "Internal server error"});
    }
});
eventRouter.get("/getAll", async (req, res) => {
    const data: Event[] = await dbUtility.getAllFromTable("event");

    const locations = await dbUtility.getAllFromTable("location");

    res.status(200).json({data, locations });
});