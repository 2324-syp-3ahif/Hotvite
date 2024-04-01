export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    aboutme: string;
}
export interface Address {
    id: string;
    Street: string;
    city: string;
    country: string;
    state: string;
}

export interface Location {
    id: string;
    latitude: string;
    longitude: string;
}

export interface Chat {
    id: string;
    about: string;
    name: string;
}

export interface Condition {
    event_id: string;
    text: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    address: Address;
    location: Location;
    type: string;
    creator_id: string;
    status: string;
    chat: Chat;
    created_at: number;
    event_start_date: number;
    event_end_date: number;
    conditions: Condition[];
}