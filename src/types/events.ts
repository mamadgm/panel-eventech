export interface Event {
    name: string;
    start_acceptance: string;
    start_time: string;
    end_time: string;
    default_hall: number;
    categories: string[];
}

export interface Hall {
    id: number;
    name: string;
    capacity: string;
    image: string | null;
    address: string;
}


export interface CinemaData {
    event: number
    position_matrix: number[][]
}

export interface ChairClickPayload {
    rowIndex: number
    colIndex: number
    cellValue: number
}


// API hooks
export interface CinemaData {
    id: number;
    event_name: string;
    event_start_time: string;
    event_end_time: string;
    position_matrix: number[][];
}

export interface CinemaPostData {
    event: number;
    position_matrix: number[][];
}



export interface Guest {
    event: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    ticket_number: string;
    ticket_registration_datetime: string;
    is_vip: boolean;
}

// API Integration
export interface GuestData {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    ticket_number: string;
    is_vip: boolean;
}

export interface Speaker {
    id: number;
    phone_number: string;
    first_name: string;
    last_name: string;
    image: string;
    email: string;
}

export interface Scene {
    id: number;
    speaker: Speaker;
    name: string;
    start_time: string;
    end_time: string;
    descriptions: string;
    speaker_first_name: string;
    speaker_last_name: string;
    status: boolean;
}

// This is for the array structure you pointed out
export type SceneList = Scene[];

// Input version (used in POST/PUT requests)
export interface SceneInput {
    speaker: string;
    name: string;
    start_time: string;
    end_time: string;
    speaker_first_name: string;
    speaker_last_name: string;
    descriptions: string;
}
