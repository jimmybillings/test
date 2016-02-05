import { Authentication } from '../../../common/services/authentication.data.service';
import { CurrentUser } from '../../../common/models/current-user.model';
export declare class Logout {
    private _authentication;
    private _currentUser;
    constructor(_authentication: Authentication, _currentUser: CurrentUser);
    onSubmit(): void;
}
