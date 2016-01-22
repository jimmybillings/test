import { Component } from 'angular2/core';
import { FormBuilder } from 'angular2/common';
import {Authentication} from '../../../common/services/authentication.data.service';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

@Component({
  selector: 'login',
  templateUrl: 'components/user-management/login/login.html',
  providers: [Authentication],
  directives: [MATERIAL_DIRECTIVES]
})

export class Login {    
    public _form: Object;
    public _fb: FormBuilder;
    public _authentication: Authentication;
  
  constructor(_fb: FormBuilder, _authentication: Authentication) {
     this._fb = _fb;
     this._authentication = _authentication;
     this._loginForm();
  }
  
  public onSubmit(user: Object) {
       this._authentication.create(user);
  }
  
  private _loginForm() {
     this._form = this._fb.group({
        userId: String,
        password: String,
        accountIdentifier: 'poc1'
     });
  }
}

