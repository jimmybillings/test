export declare class CurrentUser {
    private _currentUser;
    constructor();
    set(user?: boolean): void;
    loggedIn(): Boolean;
    email(): String;
    firstName(): String;
    lastName(): String;
    fullName(): String;
    createdOn(): Date;
    lastUpdated(): Date;
    siteName(): String;
    id(): Number;
    accountIds(): Object;
    private _user();
}
