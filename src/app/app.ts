/// <reference path="../typings/tsd.d.ts" />
import 'zone.js';
import 'reflect-metadata';
import 'es6-shim';

import {Component, View, bootstrap} from 'angular2/angular2';
import { MyService } from './services/sampleService';
import { Login } from './components/user-management/login';

@Component({
  selector: 'app',
  bindings: [MyService]
})
@View({
  template: `
    <ul>
      <li>{{ appStatus }}</li>
      <li>{{ serviceStatus }}</li>
    </ul>
    <login></login>
    
  `,
  directives: [Login]
})
class MyAppComponent {
  appStatus: string;
  serviceStatus: string;

  constructor(myService: MyService) {
    this.serviceStatus = myService.getMessage();
    this.appStatus = 'Application is working.';
  }
}

bootstrap(MyAppComponent);
