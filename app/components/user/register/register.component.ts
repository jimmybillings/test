import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, ControlGroup, FormBuilder } from 'angular2/common';
import {HTTP_PROVIDERS, Http, Response, Headers} from 'angular2/http';
import {User} from '../user'
import {RouteConfig, RouteParams, ROUTER_DIRECTIVES, Router, APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router'

@Component({
  selector: 'register',
  templateUrl: '/app/components/user/register/register.html',
  directives: [FORM_DIRECTIVES],
  providers: [User]
  
})


export class Register {
    public _user: User;
    public _form: Object;
    public _fb: FormBuilder;

  constructor(
      _fb: FormBuilder, 
      _user: User) {
     this._fb = _fb;
     this._user = _user;
     this._registerForm();
  }
  
  public onSubmit(user: Object) {
       this._user.create(user)
            .subscribe((res:Response) => {
                console.log(res)
            });
  }
  
  //   PRIVATE METHODS HERE
  private _registerForm() {
     this._form = this._fb.group({
        firstName: String,
        lastName: String,
        emailAddress: String,
        accountIdentifier: 'poc1',
        password: String
     })  
  }
}





