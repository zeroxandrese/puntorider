export interface User {
    id: string;
    name: string;
    password?: string | null;
};

export interface UserClientCreate {
    numberPhone: string;
};

export interface UserClientUpdate {
    numberPhone: string;
    email: string;
    name: string;
    uid: string
};

export interface UserClientUID {
    uid: string
};

export interface JwtPayload {
    id: string;
};

export interface UserClient {
    uid: String,
    name: String,
    numberPhone: string,
    email: string,
    status: boolean,
    google: boolean,
    img: string,
    googleUserId: string,
    created: string
}

export interface UIDObject {
    uid: UserClient
}
