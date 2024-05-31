import {v4 as uuidv4} from "uuid";
import {Event} from "../models/event";
import {User} from "../models/user";
import {EventDto} from "../models/eventDto";

function generateUUIDs(event: Event, eventID: string): void {
    event.address.id = uuidv4();
    event.location.id = uuidv4();

    event.requirements = event.requirements.map(requirement =>
        ({event_id: eventID, text: requirement.text}));
}

export function createEvent(eventDto: EventDto, user: User): Event {
    const eventID = uuidv4();
    const event: Event = {...eventDto, id: eventID, creator_id: user.id} as Event;

    generateUUIDs(event, eventID);

    return event;
}


export async function isValidEvent(event: Event): Promise<boolean> {
    //possible to add check here for the future
    //checking creator_id is no longer need because of token

    return event.created_at < event.event_start_date &&
        event.event_start_date < event.event_end_date;
}
