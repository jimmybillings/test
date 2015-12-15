import {Component, View} from 'angular2/angular2';

import { MyService } from '../../services/sampleService';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {ROUTER_DIRECTIVES, RouteConfig, Router, Location, Route, RouterOutlet} from 'angular2/router';

@Component({
  selector: 'login'
})
@View({
  template: `
    <h3>{{login}}</h3>
    <form class="login" method="post">
      <div class="input-field">
        <input type="text" name="name" value="" placeholder="Email">
      </div> 
      <div class="input-field">
        <input type="password" name="name" value="" placeholder="Password">
      </div>
      <div class="input-field">
        <a class="waves-effect waves-light btn">Login</a>
      </div>
    </form>
  `
})

export class Login {
  login: string;
  constructor() {
    this.login = 'Login'
  }
}
