import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';

@Component({
  selector: 'login',
  templateUrl: '/app/components/user-management/login.html'
})

export class Login {    
  login: string;
  constructor() {
    this.login = 'Login'
  }
}
