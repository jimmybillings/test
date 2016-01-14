import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, ControlGroup, FormBuilder } from 'angular2/common';
import {HTTP_PROVIDERS, Http, Response, Headers} from 'angular2/http';

import {RegisterUser} from './register.interface'
@Component({
  selector: 'register',
  templateUrl: '/app/components/user/register/register.html',
  directives: [FORM_DIRECTIVES]
})

export class Register {
    public user: RegisterUser;
    public form: Object;
    public http: Http;
    public fb: FormBuilder;

  constructor(fb: FormBuilder, http: Http) {
     this.user = new RegisterUser()
     this.http = http;
     this.fb = fb;
     this.registerForm();
  }
  
  registerForm() {
     this.form = this.fb.group({
        firstName: String,
        lastName: String,
        emailAddress: String,
        accountIdentifier: 'poc1',
        password: String
     })  
  }
  
  onSubmit(user: Object) {
       this.http.post('http://poc1.crux.t3sandbox.xyz./users-api/user/register', 
        JSON.stringify(user), {
           headers: new Headers({'Content-Type': 'application/json'})
        }
       ).subscribe((res:Response) => {
            console.log(res)
       });
  }
}


