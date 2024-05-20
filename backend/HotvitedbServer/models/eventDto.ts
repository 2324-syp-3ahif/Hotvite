import {Address} from "./address";
import {Condition} from "./condition";
import {Chat} from "./chat";
import {Location} from "./location";
import {AddressDto} from "./addressDto";
import {LocationDto} from "./locationDto";
import {ChatDto} from "./chatDto";
import {ConditionDto} from "./conditionDto";

export interface EventDto {
    title: string;
    description: string;
    address: AddressDto;
    location: LocationDto;
    type: string;
    status: string;
    creator_id: string;
    chat: ChatDto;
    created_at: number;
    event_start_date: number;
    event_end_date: number;
    conditions: ConditionDto[];
}