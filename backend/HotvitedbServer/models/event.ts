import {Address} from "./address";
import {Condition} from "./condition";
import {Chat} from "./chat";
import {Location} from "./location";

export interface Event {
    id: string;
    title: string;
    description: string;
    address: Address;
    location: Location;
    type: string;
    status: string;
    creator_id: string;
    chat: Chat;
    created_at: number;
    event_start_date: number;
    event_end_date: number;
    conditions: Condition[];
}