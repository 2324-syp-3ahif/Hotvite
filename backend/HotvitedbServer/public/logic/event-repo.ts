import {Event} from "../model";
import {v4 as uuidv4} from "uuid";
import {dbUtility} from "../utilities/db-utilities";

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

export async function isValidEvent(event: Event): Promise<boolean> {
    //check if creatorID is valid

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