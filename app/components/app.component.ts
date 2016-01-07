import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';

import {Login} from './user-management/login.component';
import {Register} from './user-management/register.component'
import {Home} from './home/home.component'

import { MyService } from '../services/sampleService';

@Component({
  selector: 'app',
  bindings: [MyService],
  templateUrl: 'app/components/app.component.html',
  styles: [`pre {color:red}`],
  directives: [ROUTER_DIRECTIVES, Login],
  providers: [MyService]
})

@RouteConfig([
  { path: '/home',  name: 'Home', component: Home, useAsDefault: true},
  { path: '/user-management/register',  name: 'Register', component: Register},
  { path: '/user-management/login', name: 'Login', component: Login}
])

export class AppComponent {
  location: Location;
  appStatus: string;
  serviceStatus: string;
  makey: string;

  constructor(myService: MyService) {

    this.serviceStatus = myService.getMessage();
    this.appStatus = 'Application is working Jeff';
  }

  make() {
    this.makey = 'hello'
  }
}
