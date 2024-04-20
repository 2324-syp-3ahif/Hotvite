import {v4 as uuidv4} from "uuid";
import {dbUtility} from "../utilities/db-utilities";
import {Event} from "../models/event";
import express from "express";
import {AuthRequest} from "../models/authRequest";
import {User} from "../models/user";

export function createEvent(event: Event, user: User): Event {
    //create ids

    const eventID = uuidv4()

    event.id = eventID;
    event.address.id = uuidv4();
    event.location.id = uuidv4();
    event.chat.id = uuidv4();
    event.conditions.forEach(c => c.event_id = eventID);

    event.creator_id = user.id;

    return event;
}

export async function isValidEvent(event: Event): Promise<boolean> {
    //possible to add check here for the future
    //checking creator_id is no longer need because of token

    return !(event.created_at > event.event_start_date ||
        event.event_start_date > event.event_end_date);
}
