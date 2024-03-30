import express from "express";
import {Event} from "../model"
import {createEvent} from "../logic/event-repo";

export const eventRouter = express.Router();

eventRouter.post("/create", async (req, res) => {
    try {
        const event: Event = createEvent(req.body);


        res.json(event);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({error: "Internal server error"});
    }
});