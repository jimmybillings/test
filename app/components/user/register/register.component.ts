import {Component} from 'angular2/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from 'angular2/common';
import {HTTP_PROVIDERS, Http, Response, Headers} from 'angular2/http';

import {User} from '../user.interface'
@Component({
  selector: 'register',
  templateUrl: '/app/components/user/register/register.html',
  directives: [FORM_DIRECTIVES]
})

export class Register {
    public user: User;
    public registerForm: Object;
    public http: Http;
    public headers: Headers;

  constructor(fb: FormBuilder, http: Http, headers: Headers) {
     this.user = new User()
     this.http = http;
     this.registerForm = fb.group({
        firstName: [this.user.firstName],
        lastName: [this.user.lastName],
        emailAddress: [this.user.emailAddress],
        accountIdentifier: 'poc1',
        password: [this.user.password]
     }) 
  }
  
  onSubmit(user: Object) {
       this.headers.append('Content-Type', 'application/json');
       this.http.post('http://poc1.crux.t3sandbox.xyz./users-api/user/register', user.toString(), {
           headers: this.headers
        })
        .subscribe((res:Response) => {
            console.log(res)
        });
  }
}


