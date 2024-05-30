import {Address} from "./address";
import {Requirement} from "./requirement";
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
    price: number;
    max_participants: number;
    chat: boolean;
    created_at: number;
    event_start_date: number;
    event_end_date: number;
    requirements: Requirement[];
}
