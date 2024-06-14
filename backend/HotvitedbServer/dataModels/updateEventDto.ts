import {AddressDto} from "./addressDto";
import {LocationDto} from "./locationDto";

export interface UpdateEventDto {
    title: string;
    description: string;
    address: AddressDto;
    location: LocationDto;
    type: string;
    chat: boolean;
    price: number;
    max_participants: number;
    event_start_date: number;
    event_end_date: number;
    requirements: string[];
}