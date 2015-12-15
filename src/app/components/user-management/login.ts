import {Component, View} from 'angular2/angular2';

import { MyService } from '../../services/sampleService';

@Component({
  selector: 'login'
})
@View({
  templateUrl: 'app/components/user-management/login.html'
})
export class Login {
  constructor() {

  }
}
