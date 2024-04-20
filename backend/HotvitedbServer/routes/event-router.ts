import express from "express";
import {createEvent, isValidEvent} from "../logic/event-repo";
import {dbUtility} from "../utilities/db-utilities";
import {Event} from "../models/event";
import {Location} from "../models/location";
import {isAuthenticated} from "../middleware/auth-handler";
import {AuthRequest} from "../models/authRequest";

export const eventRouter = express.Router();

eventRouter.post("/create", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await dbUtility.getTableByValue("user", "email", payload.user.email);

        const event: Event = createEvent(req.body, user);

        if (!await isValidEvent(event)) {
            return res.sendStatus(405);
        }

        await dbUtility.saveEvent(event);

        res.status(201).json(event);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

eventRouter.get("/getAll", async (req, res) => {
    try {
        const data: Event[] = await dbUtility.getAllFromTable("event");

        res.status(200).json(data);
    } catch (error) {
        console.error("Error getting all events:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

eventRouter.get("/getLocationsFromUser", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await dbUtility.getTableByValue("user", "email", payload.user.email);

        const allLocations: Location[] = await dbUtility.getAllFromTable("location");

        const result = allLocations.filter(location => location.id === user.id);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting locations from user:", error);
        res.status(500).json({error: "Internal server error"});
    }
});