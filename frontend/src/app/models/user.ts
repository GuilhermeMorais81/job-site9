export interface SignupRequest {
    name : string;
    email : string;
    password : string;
    isCompany : boolean;
}

export interface LoginRequest {
    email : string;
    password : string;
}

export interface LoggedUser {
    id : string;
    name : string;
    email : string;
    isCompany : boolean;
}
