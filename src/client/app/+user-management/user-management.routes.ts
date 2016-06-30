import {RouterConfig} from '@angular/router';
import {LoginComponent} from './+login/login.component';
import {RegisterComponent} from './+register/register.component';
import {ProfileComponent} from './+profile/profile.component';

export const USER_ROUTES: RouterConfig =[
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent }
];