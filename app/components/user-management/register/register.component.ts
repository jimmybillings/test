import {Component} from 'angular2/core';
import {FormBuilder, ControlGroup, FORM_DIRECTIVES} from 'angular2/common';
import {Response} from 'angular2/http';
import {User} from '../../../common/services/user.data.service';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';

@Component({
  selector: 'register',
  templateUrl: 'components/user-management/register/register.html',
  providers: [User],
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})

export class Register {
    public _user: User;
    public registerForm: ControlGroup;
    public _fb: FormBuilder;
    private _ApiConfig: ApiConfig;

  constructor(
      _fb: FormBuilder, 
      _user: User,
      _ApiConfig: ApiConfig) {
     this._fb = _fb;
     this._user = _user;
     this._ApiConfig = _ApiConfig;
     this._registerForm();
  }
  
  public onSubmit(user: any) {
    this._user.create(user)
      .subscribe((res:Response) => {
        console.log(res);
      });
  }
  
  //   PRIVATE METHODS HERE
  private _registerForm() {
     this.registerForm = this._fb.group({
        'firstName': null,
        'lastName': null,
        'emailAddress': null,
        'accountIdentifier': this._ApiConfig.getPortal(),
        'password': null
     }); 
  }
}





