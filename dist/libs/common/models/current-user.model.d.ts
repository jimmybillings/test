export declare class CurrentUser {
    private _currentUser;
    constructor();
    set(user?: boolean): void;
    loggedIn(): boolean;
    email(): string;
    firstName(): string;
    lastName(): string;
    fullName(): string;
    createdOn(): Date;
    lastUpdated(): Date;
    siteName(): string;
    id(): number;
    accounts(): [{
        id: string;
    }];
    private _user();
}
