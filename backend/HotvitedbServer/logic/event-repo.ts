import {v4 as uuidv4} from "uuid";
import {dbUtility} from "../utilities/db-utilities";
import {Event} from "../models/event";

export function createEvent(event: Event): Event {
    //create ids

    const eventID = uuidv4()

    event.id = eventID;
    event.address.id = uuidv4();
    event.location.id = uuidv4();
    event.chat.id = uuidv4();
    event.conditions.forEach(c => c.event_id = eventID);

    return event;
}

export async function isValidEvent(event: object): Promise<boolean> {
    //check if creatorID is valid

    if (!isEvent(event)) {
        return false;
    }

    if (!await dbUtility.hasEntryInColumnInTable("user", "id", event.creator_id)) {
        //creatorID has no entry in table user
        return false;
    }

    if (event.created_at > event.event_start_date ||
        event.event_start_date > event.event_end_date) {
        //not valid dates
        return false;
    }

    return true;
}

function isEvent(obj: object): obj is Event {
    if (
        "title" in obj &&
        "description" in obj &&
        "address" in obj &&
        "location" in obj &&
        "type" in obj &&
        "creator_id" in obj &&
        "status" in obj &&
        "chat" in obj &&
        "created_at" in obj &&
        "event_start_date" in obj &&
        "event_end_date" in obj &&
        "conditions" in obj
    ) {
        if (Number.isInteger(obj.created_at) &&
            Number.isInteger(obj.event_start_date) &&
            Number.isInteger(obj.event_end_date)) {
            return true;
        }
    }

    return false;
}