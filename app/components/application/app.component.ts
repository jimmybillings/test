import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Header} from './header/header.component'
import {User} from '../user-management/user-management.component'
import {Home} from '../home/home.component'
import {Search} from '../search/search.component'

@Component({
  selector: 'app',
  templateUrl: 'app/components/application/app.html',
  directives: [ROUTER_DIRECTIVES, Header, User]
})

@RouteConfig([
  { path: '/',  name: 'Home', component: Home, useAsDefault: true},
  { path: '/user/...', component: User, as: 'User'},
  { path: '/search', component: Search, as: 'Search'}, 
])

export class AppComponent {    
    constructor() {}  
}
