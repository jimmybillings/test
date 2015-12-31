import {Component} from 'angular2/core';
import { MyService } from '../../services/sampleService';

@Component({
  selector: 'login',
  templateUrl: '/app/components/user-management/login.template.html'
})


export class Login {    
  login: string;
  constructor() {
    this.login = 'Login'
  }
}
