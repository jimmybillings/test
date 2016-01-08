import {Component} from 'angular2/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from 'angular2/common';

import {User} from '../user.interface'
@Component({
  selector: 'register',
  templateUrl: '/app/components/user/register/register.html',
  directives: [FORM_DIRECTIVES]
})

export class Register {
    public user: User;
    public registerForm: Object;
  
  constructor(fb: FormBuilder) {
     this.user = new User()
     
     this.registerForm = fb.group({
        firstName: [this.user.firstName],
        lastName: [this.user.lastName],
        street: [this.user.street],
        state: [this.user.state],
        city: [this.user.city],
        zipCode: [this.user.zipCode],
        password: [this.user.password]
     }) 
  }
  
  onSubmit(user: Object) {
      console.log(user)
  }
}

