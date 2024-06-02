import {v4 as uuidv4} from "uuid";
import {Event} from "../models/event";
import {User} from "../models/user";
import {EventDto} from "../models/eventDto";
import {Requirement} from "../models/requirement";

export function createUUID(): string {
    return uuidv4();
}

export function createRequirements(requirements: string[], eventId: string): Requirement[] {
    return requirements.map(req => {
        return {event_id: eventId, text: req};
    });
}

export function createEvent(eventDto: EventDto, user: User): Event {
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


export async function isValidEvent(event: Event): Promise<boolean> {
    //possible to add check here for the future
    //checking creator_id is no longer need because of token

    return event.created_at < event.event_start_date &&
        event.event_start_date < event.event_end_date;
}
