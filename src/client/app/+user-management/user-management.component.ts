import {Component} from '@angular/core';
import {RouterConfig, ROUTER_DIRECTIVES} from '@angular/router';
import {LoginComponent} from './+login/login.component';
import {RegisterComponent} from './+register/register.component';
import {ProfileComponent} from './+profile/profile.component';
import { User } from './services/user.data.service';

export const USER_ROUTES: RouterConfig =[
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent }
];

@Component({
  moduleId: module.id,
  selector: 'user',
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES],
  providers: [User]
})

export class UserManagementComponent {}
