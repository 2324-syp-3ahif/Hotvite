import express from "express";
import {Event} from "../dataModels/event";
import {Location} from "../dataModels/location";
import {isAuthenticated} from "../middleware/auth-handler";
import {AuthRequest} from "../dataModels/authRequest";
import {User} from "../dataModels/user";
import {StatusCodes} from "http-status-codes";
import {UpdateEventDto} from "../dataModels/updateEventDto";
import {Event_participant} from "../dataModels/event_participant";
import {UserPublic} from "../dataModels/userPublic";
import {Address} from "../dataModels/address";
import {Requirement} from "../dataModels/requirement";
import {v4 as uuidv4} from "uuid";
import {EventDto} from "../dataModels/eventDto";
import {databaseManager} from "../databaseManager";

export const eventRouter = express.Router();

eventRouter.post("/create", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await databaseManager.getTableByValue<User>("user", "email", payload.user.email);

        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Events can only be created by registered users"});
        }

        const event: Event = createEvent(req.body, user);

        if (!await isValidEvent(event)) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Invalid event"});
        }

        await databaseManager.saveEvent(event);

        res.status(StatusCodes.CREATED).json(true);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while creating event"});
    }
});

eventRouter.get("/isCreator/:id", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await databaseManager.getTableByValue<User>("user", "email", payload.user.email);
        const event = await databaseManager.getTableByValue<Event>("event", "id", req.params.id);

        if (!user || !event) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or event does not exist"});
        }

        const result = event.creator_id === user.id;

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error("Error checking if user is creator of event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while checking if user is creator of event"});
    }
});

eventRouter.get("/getEventById/:id", async (req, res) => {
    const data: Event[] | undefined = await databaseManager.getAllFromTable("event");

    const result = data?.filter(event => event.id === req.params.id)[0];

    if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({error: "Event not found"});
    }
    res.status(200).json(result);
});

eventRouter.get("/getAll", async (req, res) => {
    try {
        const data = await databaseManager.getAllFromTable<Event[]>("event");

        res.status(StatusCodes.OK).json(data);
    } catch (error) {
        console.error("Error getting all events:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while getting all events"});
    }
});

eventRouter.put("/changeEventDetails/:id", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventId = req.params.id;
        const newEvent: UpdateEventDto = req.body;

        const user = await databaseManager.getTableByValue<User>("user", "email", payload.user.email);
        const eventExists = await databaseManager.getTableByValue<Event>("event", "id", eventId)

        if (!user || !eventExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or event does not exist"});
        }

        if (eventExists.creator_id !== user.id) {
            return res.status(StatusCodes.FORBIDDEN).json({error: "User is not the creator of the event"});
        }

        const result = await databaseManager.updateEvent(eventId, newEvent)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error("Error registering user to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while updating event details"});
    }
});

eventRouter.put("/register/:id", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventID = req.params.id;

        const user = await databaseManager.getTableByValue<User>("user", "email", payload.user.email);
        const event = await databaseManager.getTableByValue<Event>("event", "id", eventID);

        if (!user || !event) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or event does not exist"});
        }

        const creator = await databaseManager.getTableByValue<User>("user", "id", event?.creator_id);
        if (creator?.id === user.id) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Creator cannot join their own event"});
        }

        if(await databaseManager.isUserRegisteredToEvent(user, event)){
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User is already registered to this event"});
        }

        const result = await databaseManager.registerUserToEvent(user, event)

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

        const user = await databaseManager.getTableByValue<User>("user", "email", payload.user.email);
        const event = await databaseManager.getTableByValue<Event>("event", "id", eventID)

        if (!user || !event) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or event does not exist"});
        }

        const result = await databaseManager.unregisterUserFromEvent(user, event)

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

        const user = await databaseManager.getTableByValue<User>("user", "email", payload.user.email);
        const event = await databaseManager.getTableByValue<Event>("event", "id", eventID)

        if (!user || !event) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or event does not exist"});
        }

        const result = await databaseManager.isUserRegisteredToEvent(user, event);

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error("Error checking if user is registered to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while checking if user is registered to event"});
    }
});

eventRouter.get("/getParticipantsFromEvent/:event_id", async (req, res) => {
    try {
        const event_id = req.params.event_id;

        const participants = await databaseManager.getAllFromTable<Event_participant[]>("event_participant");

        if (!participants) {
            return res.status(StatusCodes.OK).json({users: []});
        }

        const userIDs = participants.filter(value => value.event_id === event_id).map(value => value.user_id);
        const allUsers = await databaseManager.getAllFromTable<User[]>("user");

        if (!allUsers) {
            return res.status(StatusCodes.CONFLICT).json({error: "No users found"});
        }

        const users : UserPublic[] = allUsers.filter(user => userIDs.includes(user.id)).map(user => ({username: user.username, about_me: user.aboutme}));
        res.status(200).json({users: users});

    } catch (error) {
        console.error("Error getting users from event", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while getting users from event"});
    }
});

eventRouter.delete("/deleteEvent/:id", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const eventID = req.params.id;

        const user = await databaseManager.getTableByValue<User>("user", "email", payload.user.email);
        const event = await databaseManager.getTableByValue<Event>("event", "id", eventID)

        if (!user || !event) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "User or event does not exist"});
        }

        if (event.creator_id !== user.id) {
            return res.status(StatusCodes.FORBIDDEN).json({error: "User is not the creator of the event"});
        }

        const result = await databaseManager.deleteRowInTable("event", "id", event.id);

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error("Error unregistering user to event:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong while deleting event"});
    }
});


eventRouter.get("/getMyLocations", isAuthenticated, async (req, res) => {
    try {
        const payload = (req as AuthRequest).payload;
        const user = await databaseManager.getTableByValue<User>("user", "email", payload.user.email);

        const allLocations = await databaseManager.getAllFromTable<Location[]>("location");

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
    const location = await databaseManager.getTableByValue<Location>("location", "id", req.params.id);

    if (!location) {
        return res.status(StatusCodes.NOT_FOUND).json({error: "Location not found"});
    }

    res.status(200).json(location);
});

eventRouter.get("/getAddressById/:id", async (req, res) => {
    const address = await databaseManager.getTableByValue<Address>("address", "id", req.params.id);

    if (!address) {
        return res.status(StatusCodes.NOT_FOUND).json({error: "Address not found"});
    }

    res.status(StatusCodes.OK).json(address);
});

eventRouter.get("/getRequirementsByEventId/:id", async (req, res) => {
    try {
        const data = await databaseManager.getAllFromTable<Requirement[]>("requirement");
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

function createUUID(): string {
    return uuidv4();
}

export function createRequirements(requirements: string[], eventId: string): Requirement[] {
    return requirements.map(req => {
        return {event_id: eventId, text: req};
    });
}

function createEvent(eventDto: EventDto, user: User): Event {
    const eventId = createUUID();
    const addressId = createUUID();
    const locationId = createUUID();

    const requirementObjects = createRequirements(eventDto.requirements, eventId);
    return {
        id: eventId,
        title: eventDto.title,
        description: eventDto.description,
        address: {
            id: addressId,
            ...eventDto.address
        },
        location: {
            id: locationId,
            ...eventDto.location
        },
        type: eventDto.type,
        chat: eventDto.chat,
        price: eventDto.price,
        max_participants: eventDto.max_participants,
        created_at: eventDto.created_at,
        event_start_date: eventDto.event_start_date,
        event_end_date: eventDto.event_end_date,
        requirements: requirementObjects,
        creator_id: user.id,
        status: "active"
    }
}


async function isValidEvent(event: Event): Promise<boolean> {
    //possible to add check here for the future
    //checking creator_id is no longer need because of token

    if (!event.address.city || !event.address.country || !event.address.street) {
        return false;
    }

    return event.created_at < event.event_start_date &&
        event.event_start_date < event.event_end_date;
}
