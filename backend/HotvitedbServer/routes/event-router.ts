import express from "express";
import {createEvent, isValidEvent} from "../logic/event-repo";
import {dbUtility} from "../utilities/db-utilities";
import {Event} from "../models/event";
import {Location} from "../models/location";
import {isAuthenticated} from "../middleware/auth-handler";
import {AuthRequest} from "../models/authRequest";
import {User} from "../models/user";

export const eventRouter = express.Router();

eventRouter.post("/create", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);

        if(!user){
            return res.sendStatus(500);
        }

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
        const data = await dbUtility.getAllFromTable<Event[]>("event");

        res.status(200).json(data);
    } catch (error) {
        console.error("Error getting all events:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

eventRouter.post("/register", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventID = req.body.event_id;

        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);
        const event = await dbUtility.getTableByValue<Event>("event", "id", eventID)

        if (!user || !event) {
            return res.sendStatus(500);
        }

        let result = await dbUtility.registerUserToEvent(user, event)

        res.send(200).json({result: result, user: user, event: event});
    } catch (error) {
        console.error("Error registering user to event:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

eventRouter.delete("/unregister", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventID = req.body.event_id;

        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);
        const event = await dbUtility.getTableByValue<Event>("event", "id", eventID)

        if (!user || !event) {
            return res.sendStatus(500);
        }

        let result = await dbUtility.unregisterUserFromEvent(user, event)

        res.send(200).json({result: result, user: user, event: event});
    } catch (error) {
        console.error("Error unregistering user to event:", error);
        res.status(500).json({error: "Internal server error"});
    }
});


eventRouter.get("/getLocationsFromUser", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);

        const allLocations = await dbUtility.getAllFromTable<Location[]>("location");

        if(!allLocations || !user){
            return res.sendStatus(500);
        }

        const result = allLocations.filter(location => location.id === user.id);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting locations from user:", error);
        res.status(500).json({error: "Internal server error"});
    }
});