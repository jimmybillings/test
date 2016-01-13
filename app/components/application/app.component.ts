import {Component} from 'angular2/core';
import {
    RouteConfig, 
    ROUTER_DIRECTIVES,
    LocationStrategy, 
    HashLocationStrategy,
    AsyncRoute
} from 'angular2/router';

import {Header} from './header/header.component'
import {User} from '../user/user.component'
import {Home} from '../home/home.component'

@Component({
  selector: 'app',
  templateUrl: 'app/components/application/app.html',
  directives: [ROUTER_DIRECTIVES, Header, User]
})

@RouteConfig([
  { path: '/',  name: 'Home', component: Home, useAsDefault: true},
  { path: '/user/...', component: User, as: 'User'},
])

export class AppComponent {
    constructor() {
        
    }  
}
