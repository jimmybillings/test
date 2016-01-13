import {Component} from 'angular2/core';


@Component({
  selector: 'login',
  templateUrl: '/app/components/user/login/login.html'
})

export class Login {    
  login: string;
  user: Object;
  
  constructor() {
    this.login = 'Login'
  }
  
  signup(user) {
     this.user = user; 
  }
}
