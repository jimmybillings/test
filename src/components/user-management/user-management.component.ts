import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Login} from './login/login.component';
import {Register} from './register/register.component';
import {Profile} from './profile/profile.component';
import {Valid} from '../../common/services/validator.form.service';

@Component({
  selector: 'user',
  template: '<router-outlet></router-outlet>',
  directives: ROUTER_DIRECTIVES,
  providers: [Valid]
})

@RouteConfig([
  { path: '/register', component: Register, name: 'Register' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/profile', component: Profile, name: 'Profile' }
])

export class UserManagement {
 }
