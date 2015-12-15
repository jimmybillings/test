/// <reference path="../typings/tsd.d.ts" />
import 'zone.js';
import 'reflect-metadata';
import 'es6-shim';

import {Component, View, bootstrap, provide} from 'angular2/angular2';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {ROUTER_DIRECTIVES, RouteConfig, Router, Location, Route, RouterOutlet} from 'angular2/router';

import { MyService } from './services/sampleService';
import { Login } from './components/user-management/login';
import { Register } from './components/user-management/register';

@RouteConfig([
  {path: '/', component: Login},
  {path: '/register', component: Register}
])

@Component({
  selector: 'app',
  bindings: [MyService]
})

@View({
  template: `
    <div class="container">
      <div class="row">
        <div class="col s6">
          <h1>Wazee Digital</h1>
        </div>
        <div class="col s6">
          <ul>
            <li>{{ appStatus }}</li>
            <li>{{ serviceStatus }}</li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <main>
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>

  `,
  directives: [Login, ROUTER_DIRECTIVES]
})

class MyAppComponent {
  router: Router;
  location: Location;
  appStatus: string;
  serviceStatus: string;

  constructor(router: Router, location: Location, myService: MyService) {
    this.router = router;
    this.location = location;
    this.serviceStatus = myService.getMessage();
    this.appStatus = 'Application is working.';
  }
}

bootstrap(MyAppComponent, [ROUTER_PROVIDERS, provide(LocationStrategy, {useClass: HashLocationStrategy})]);
