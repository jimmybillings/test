import {Component} from 'angular2/core';
import { MyService } from '../services/sampleService';
import {Login} from './user-management/login.component'

@Component({
  selector: 'app',
  bindings: [MyService],
  templateUrl: 'app/components/app.component.html',
  styles: [`p {color:red}`],
  directives: [Login],
  providers: [MyService]
})

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
