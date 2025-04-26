export interface Event {
    name: string;
    // image: string;
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