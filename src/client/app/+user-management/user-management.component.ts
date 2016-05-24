import {Component} from '@angular/core';
import {Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {LoginComponent} from './+login/login.component';
import {RegisterComponent} from './+register/register.component';
import {ProfileComponent} from './+profile/profile.component';
import { User } from './services/user.data.service';

@Component({
  moduleId: module.id,
  selector: 'user',
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES],
  providers: [User]
})

@Routes([
  { path: '/register', component: RegisterComponent },
  { path: '/login', component: LoginComponent },
  { path: '/profile', component: ProfileComponent }
])

export class UserManagementComponent {
}
