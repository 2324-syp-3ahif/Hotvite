import {Event} from "../model";
import {v4 as uuidv4} from "uuid";
import {dbUtility} from "../utilities/db-utilities";

export function createEvent(event: Event): Event {
    //create ids

    event.id = uuidv4();
    event.address.id = uuidv4();
    event.location.id = uuidv4();
    event.chat.id = uuidv4();
    event.condition.id = uuidv4();

    return event;
}

export async function isValidEvent(event: Event): Promise<boolean> {
    //check if creatorID is valid

    if (!await dbUtility.hasEntryInColumnInTable("user", "id", event.creator_id)) {
        //creatorID has no entry in table user
        return false;
    }

    return true;
}