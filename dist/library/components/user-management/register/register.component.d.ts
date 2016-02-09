import { FormBuilder, ControlGroup } from 'angular2/common';
import { User } from '../../../common/services/user.data.service';
import { ApiConfig } from '../../../common/config/api.config';
export declare class Register {
    _user: User;
    registerForm: ControlGroup;
    _fb: FormBuilder;
    private _ApiConfig;
    constructor(_fb: FormBuilder, _user: User, _ApiConfig: ApiConfig);
    onSubmit(user: Object): void;
    private _setForm();
}
