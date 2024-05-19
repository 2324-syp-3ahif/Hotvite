import express from "express";
import {createEvent, isValidEvent} from "../logic/event-repo";
import {dbUtility} from "../utilities/db-utilities";
import {Event} from "../models/event";
import {Location} from "../models/location";
import {isAuthenticated} from "../middleware/auth-handler";
import {AuthRequest} from "../models/authRequest";
import {User} from "../models/user";
import {StatusCodes} from "http-status-codes";
import {UpdateEventDto} from "../models/updateEventDto";

export const eventRouter = express.Router();

eventRouter.post("/create", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);

        if(!user){
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const event: Event = createEvent(req.body, user);

        if (!await isValidEvent(event)) {
            return res.sendStatus(StatusCodes.METHOD_NOT_ALLOWED);
        }

        await dbUtility.saveEvent(event);

        res.status(StatusCodes.CREATED).json(event);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

eventRouter.get("/getAll", async (req, res) => {
    try {
        const data = await dbUtility.getAllFromTable<Event[]>("event");

        res.status(StatusCodes.OK).json(data);
    } catch (error) {
        console.error("Error getting all events:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

eventRouter.post("/changeEventDetails", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const newEvent: UpdateEventDto = req.body;

        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);
        const oldEvent = await dbUtility.getTableByValue<Event>("event", "id", newEvent.id)

        if (!user || !oldEvent) {
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        if (oldEvent.creator_id !== user.id) {
            return res.sendStatus(StatusCodes.METHOD_NOT_ALLOWED);
        }

        const result = await dbUtility.updateEvent(newEvent)

        res.status(StatusCodes.OK).json({result: result});
    } catch (error) {
        console.error("Error registering user to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

eventRouter.post("/register", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventID = req.body.event_id;

        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);
        const event = await dbUtility.getTableByValue<Event>("event", "id", eventID)

        if (!user || !event) {
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const result = await dbUtility.registerUserToEvent(user, event)

        res.status(StatusCodes.OK).json({result: result});
    } catch (error) {
        console.error("Error registering user to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

eventRouter.post("/unregister", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventID = req.body.event_id;

        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);
        const event = await dbUtility.getTableByValue<Event>("event", "id", eventID)

        if (!user || !event) {
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const result = await dbUtility.unregisterUserFromEvent(user, event)

        res.status(StatusCodes.OK).json({result: result});
    } catch (error) {
        console.error("Error unregistering user to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

eventRouter.delete("/deleteEvent", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventID = req.body.event_id;

        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);
        const event = await dbUtility.getTableByValue<Event>("event", "id", eventID)

        if (!user || !event) {
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        if (event.creator_id !== user.id) {
            return res.sendStatus(StatusCodes.METHOD_NOT_ALLOWED);
        }

        const result = await dbUtility.unregisterUserFromEvent(user, event)

        res.status(StatusCodes.OK).json({result: result});
    } catch (error) {
        console.error("Error unregistering user to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});


eventRouter.get("/getLocationsFromUser", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);

        const allLocations = await dbUtility.getAllFromTable<Location[]>("location");

        if(!allLocations || !user){
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const result = allLocations.filter(location => location.id === user.id);

        res.status(StatusCodes.OK).json({result: result});
    } catch (error) {
        console.error("Error getting locations from user:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});