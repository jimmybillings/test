import {Component} from 'angular2/core';

@Component({
  selector: 'register',
  templateUrl: '/app/components/user-management/register.html'
})

export class Register {
  register: string;
  constructor() {
    this.register = 'Register'
  }
}
