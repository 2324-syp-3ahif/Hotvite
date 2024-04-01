import express from "express";
import {Event} from "../model"
import {createEvent, isValidEvent} from "../logic/event-repo";

export const eventRouter = express.Router();

eventRouter.post("/signup", async (req, res) => {
    try {
        const event: Event = createEvent(req.body);

        if(!await isValidEvent(event)){
            res.sendStatus(405);
            return;
        }

        res.json(event);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({error: "Internal server error"});
    }
});