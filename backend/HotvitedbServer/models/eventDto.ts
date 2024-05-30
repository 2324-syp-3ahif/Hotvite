import {AddressDto} from "./addressDto";
import {LocationDto} from "./locationDto";
import {ConditionDto} from "./conditionDto";
import {Requirement} from "./requirement";

export interface EventDto {
    title: string;
    description: string;
    address: AddressDto;
    location: LocationDto;
    type: string;
    chat: boolean;
    price: number;
    max_participants: number;
    created_at: number;
    event_start_date: number;
    event_end_date: number;
    requirements: Requirement[];
}