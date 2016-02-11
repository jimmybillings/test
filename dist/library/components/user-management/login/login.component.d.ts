import { FormBuilder, ControlGroup } from 'angular2/common';
import { Authentication } from '../../../common/services/authentication.data.service';
import { Router } from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';
import { User } from '../../../common/services/user.data.service';
import { CurrentUser } from '../../../common/models/current-user.model';
export declare class Login {
    _fb: FormBuilder;
    _authentication: Authentication;
    _user: User;
    router: Router;
    private _ApiConfig;
    private _currentUser;
    loginForm: ControlGroup;
    constructor(_fb: FormBuilder, _authentication: Authentication, _user: User, router: Router, _ApiConfig: ApiConfig, _currentUser: CurrentUser);
    ngOnInit(): void;
    onSubmit(user: Object): void;
    setForm(): void;
}
