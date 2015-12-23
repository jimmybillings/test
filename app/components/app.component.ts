import {Component} from 'angular2/core';
import { MyService } from '../services/sampleService';
import {Login} from './user-management/login.component'

@Component({
  selector: 'app',
  bindings: [MyService],
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
      <main>
        <login></login>
      </main>
    </div>
  `,
  directives: [Login],
  providers: [MyService]
})

export class AppComponent {
  location: Location;
  appStatus: string;
  serviceStatus: string;

  constructor(myService: MyService) {

    this.serviceStatus = myService.getMessage();
    this.appStatus = 'Application is working.';
  }
}
