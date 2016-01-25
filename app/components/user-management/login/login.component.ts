import { Component } from 'angular2/core';
import { FormBuilder, ControlGroup, FORM_DIRECTIVES, Validators } from 'angular2/common';
import {Authentication} from '../../../common/services/authentication.data.service';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';

@Component({
  selector: 'login',
  templateUrl: 'components/user-management/login/login.html',
  providers: [Authentication],
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})

export class Login {    
    
    public loginForm: ControlGroup;
    public _fb: FormBuilder;
    public _authentication: Authentication;
    private _ApiConfig: ApiConfig;

  
  constructor(_fb: FormBuilder, _authentication: Authentication, _ApiConfig:ApiConfig) {
     this._fb = _fb;
     this._authentication = _authentication; 
     this._ApiConfig = _ApiConfig;
     this.setForm();
  }
  
  
  public onSubmit(user: any) {
     this._authentication.create(user);
  }
  
  public setForm() {
     this.loginForm = this._fb.group({
        'userId': null,
        'password': ['',Validators.required],
        'accountIdentifier': this._ApiConfig.getPortal()
     });
  }
}


