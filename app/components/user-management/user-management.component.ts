import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Login} from './login/login.component';
import {Register} from './register/register.component';
import {Profile} from './profile/profile.component';

@Component({
  selector: 'user',
  template: '<router-outlet></router-outlet>',
  directives: ROUTER_DIRECTIVES
})

@RouteConfig([
  { path: '/register', component: Register, as: 'Register'},
  { path: '/login', component: Login, as: 'Login'},
  { path: '/profile', component: Profile, as: 'Profile'}
])

export class User { }
