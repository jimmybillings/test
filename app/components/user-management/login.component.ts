import {Component} from 'angular2/core';
import { MyService } from '../../services/sampleService';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';

@Component({
  selector: 'login',
  templateUrl: '/app/components/user-management/login.template.html',
  styleUrls: ['/app/components/user-management/user-management.css']
})


export class Login {    
  login: string;
  constructor() {
    this.login = 'Login'
  }
}
