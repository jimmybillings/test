import {Component} from 'angular2/core';
import {
    RouteConfig, 
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS, 
    LocationStrategy, 
    HashLocationStrategy,
    AsyncRoute
} from 'angular2/router';

import {Header} from './application/header.component'
import {Login} from './user-management/login/login.component';
import {Register} from './user-management/register/register.component'
import {Home} from './home/home.component'

@Component({
  selector: 'app',
  templateUrl: 'app/components/app.component.html',
  directives: [ROUTER_DIRECTIVES, Header, Login]
})

@RouteConfig([
  { path: '/home',  name: 'Home', component: Home, useAsDefault: true},
  { path: '/user-management/register',  name: 'Register', component: Register},
  { path: '/user-management/login', name: 'Login', component: Login}
])

export class AppComponent {}
