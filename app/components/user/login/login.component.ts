import {Component} from 'angular2/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from 'angular2/common';
import {HTTP_PROVIDERS, Http, Response, Headers} from 'angular2/http';
import {User} from '../user'

@Component({
  selector: 'login',
  templateUrl: '/app/components/user/login/login.html',
  styles:['p:{color:white;}'],
  providers: [User]
})

export class Login {    
    public _form: Object;
    public _fb: FormBuilder;
    public _user: User;
  
  constructor(_fb: FormBuilder, _user: User) {
     this._fb = _fb;
     this._user = _user;
     this._loginForm();
  }
  
  public onSubmit(user: Object) {
       console.log(user)
       this._user.login(user)
  }
  
  private _loginForm() {
     this._form = this._fb.group({
        userId: String,
        password: String,
        accountIdentifier: 'poc1',
     })  
  }
}
