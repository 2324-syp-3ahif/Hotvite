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
import {Event_participant} from "../models/event_participant";
import {UserPublic} from "../models/userPublic";
import {Address} from "../models/address";
import {Requirement} from "../models/requirement";

export const eventRouter = express.Router();

eventRouter.post("/create", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);

        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Events can only be created by registered users"});
        }

        const event: Event = createEvent(req.body, user);

        if (!await isValidEvent(event)) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Invalid event"});
        }

        await dbUtility.saveEvent(event);

        res.status(StatusCodes.CREATED).json({result: true, event_id: event.id});
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while creating event"});
    }
});

eventRouter.get("/getEventById/:id", async (req, res) => {
    const data: Event[] | undefined = await dbUtility.getAllFromTable("event");

    const result = data?.filter(event => event.id === req.params.id)[0];

    if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({error: "Event not found"});
    }
    res.status(200).json(result);
});

eventRouter.get("/getAll", async (req, res) => {
    try {
        const data = await dbUtility.getAllFromTable<Event[]>("event");

        res.status(StatusCodes.OK).json(data);
    } catch (error) {
        console.error("Error getting all events:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while getting all events"});
    }
});

eventRouter.post("/changeEventDetails", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const newEvent: UpdateEventDto = req.body;

        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);
        const eventExists = await dbUtility.getTableByValue<Event>("event", "id", newEvent.id)

        if (!user || !eventExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or event does not exist"});
        }

        if (eventExists.creator_id !== user.id) {
            return res.status(StatusCodes.FORBIDDEN).json({error: "User is not the creator of the event"});
        }

        const result = await dbUtility.updateEvent(newEvent)

        res.status(StatusCodes.OK).json({result: result});
    } catch (error) {
        console.error("Error registering user to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while updating event details"});
    }
});

eventRouter.put("/register/:id", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventID = req.params.id;

        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);
        const event = await dbUtility.getTableByValue<Event>("event", "id", eventID);

        if (!user || !event) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or event does not exist"});
        }

        const creator = await dbUtility.getTableByValue<User>("user", "id", event?.creator_id);
        const event_participant = await dbUtility.getTableByValue<Event_participant>("event_participant", "user_id", user.id);
        if (creator?.id === user.id) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Creator cannot join their own event"});
        }

        if(event_participant){
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User is already registered to this event"});
        }

        const result = await dbUtility.registerUserToEvent(user, event)

        res.status(StatusCodes.OK).json({result: result});
    } catch (error) {
        console.error("Error registering user to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while registering user to event"});
    }
});

eventRouter.put("/unregister/:id", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventID = req.params.id;

        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);
        const event = await dbUtility.getTableByValue<Event>("event", "id", eventID)

        if (!user || !event) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or event does not exist"});
        }

        const result = await dbUtility.unregisterUserFromEvent(user, event)

        res.status(StatusCodes.OK).json({result: result});
    } catch (error) {
        console.error("Error unregistering user to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while unregistering user from event"});
    }
});

eventRouter.get("/isUserRegistered/:id", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventID = req.params.id;

        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);
        const event = await dbUtility.getTableByValue<Event>("event", "id", eventID)

        if (!user || !event) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or event does not exist"});
        }

        const result = await dbUtility.isUserRegisteredToEvent(user, event);

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error("Error checking if user is registered to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while checking if user is registered to event"});
    }
});

eventRouter.get("/getParticipantsFromEvent/:event_id", async (req, res) => {
    try {
        const event_id = req.params.event_id;

        const participants = await dbUtility.getAllFromTable<Event_participant[]>("event_participant");

        if (!participants) {
            return res.status(StatusCodes.OK).json({users: []});
        }

        const userIDs = participants.filter(value => value.event_id === event_id).map(value => value.user_id);
        const allUsers = await dbUtility.getAllFromTable<User[]>("user");

        if (!allUsers) {
            return res.status(StatusCodes.CONFLICT).json({error: "No users found"});
        }

        const users : UserPublic[] = allUsers.filter(user => userIDs.includes(user.id)).map(user => ({username: user.username, about_me: user.about_me}));
        res.status(200).json({users: users});

    } catch (error) {
        console.error("Error getting users from event", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while getting users from event"});
    }
});

eventRouter.delete("/deleteEvent", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventID = req.body.event_id;

        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);
        const event = await dbUtility.getTableByValue<Event>("event", "id", eventID)

        if (!user || !event) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or event does not exist"});
        }

        if (event.creator_id !== user.id) {
            return res.status(StatusCodes.FORBIDDEN).json({error: "User is not the creator of the event"});
        }

        const result = await dbUtility.deleteRowInTable("event", "id", event.id);

        res.status(StatusCodes.OK).json({result: result});
    } catch (error) {
        console.error("Error unregistering user to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while deleting event"});
    }
});


eventRouter.get("/getMyLocations", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await dbUtility.getTableByValue<User>("user", "email", payload.user.email);

        const allLocations = await dbUtility.getAllFromTable<Location[]>("location");

        if(!allLocations || !user){
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or locations not found"});
        }

        const result = allLocations.filter(location => location.id === user.id);

        res.status(StatusCodes.OK).json({result: result});
    } catch (error) {
        console.error("Error getting locations from user:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while getting locations from user"});
    }
});

eventRouter.get("/getLocationById/:id", async (req, res) => {
    const location = await dbUtility.getTableByValue<Location>("location", "id", req.params.id);

    if (!location) {
        return res.status(StatusCodes.NOT_FOUND).json({error: "Location not found"});
    }

    res.status(200).json(location);
});

eventRouter.get("/getAddressById/:id", async (req, res) => {
    const address = await dbUtility.getTableByValue<Address>("address", "id", req.params.id);

    if (!address) {
        return res.status(StatusCodes.NOT_FOUND).json({error: "Address not found"});
    }

    res.status(StatusCodes.OK).json(address);
});

eventRouter.get("/getRequirementsByEventId/:id", async (req, res) => {
    try {
        const data = await dbUtility.getAllFromTable<Requirement[]>("requirement");
        const requirements = data?.filter(requirement => requirement.event_id === req.params.id);

        if(!data || !requirements){
            return res.status(StatusCodes.NOT_FOUND).json({error: "No requirements found"});
        }

        res.status(StatusCodes.OK).json(requirements);
    } catch (error) {
        console.error("Error getting all requirements:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while getting all requirements"});
    }
});