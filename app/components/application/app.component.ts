import {Component} from 'angular2/core';


import {
    RouteConfig, 
    ROUTER_DIRECTIVES,
    LocationStrategy, 
    HashLocationStrategy,
    AsyncRoute
} from 'angular2/router';

import {Header} from './header/header.component'
import {Login} from '../user/login/login.component'
import {Register} from '../user/register/register.component'
import {Home} from '../home/home.component'
import {User} from 'sample/user';

@Component({
  selector: 'app',
  templateUrl: 'app/components/application/app.html',
  directives: [ROUTER_DIRECTIVES, Header, Login],
  providers: [User]
})

@RouteConfig([
  { path: '/',  name: 'Home', component: Home, useAsDefault: true},
  { path: '/user/register',  name: 'Register', component: Register},
  { path: '/user/login', name: 'Login', component: Login}
])

export class AppComponent {
    constructor(User: User) {
        User.sayHello();
    }  
}
