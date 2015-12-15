import {Component, View} from 'angular2/angular2';

import { MyService } from '../../services/sampleService';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {ROUTER_DIRECTIVES, RouteConfig, Router, Location, Route, RouterOutlet} from 'angular2/router';

@Component({
  selector: 'register'
})

@View({
  template: `
    <div class="row">
      <h3>{{register}}</h3>
      <form class="login" method="post">
      <div class="input-field col s6">
        <input type="text" name="name" value="" placeholder="First Name">
      </div>
      <div class="input-field col s6">
        <input type="text" name="name" value="" placeholder="Last Name">
      </div>
      <div class="input-field col s6">
        <input type="text" name="name" value="" placeholder="Street">
      </div>
      <div class="input-field col s6">
        <input type="text" name="name" value="" placeholder="State">
      </div>
      <div class="input-field col s6">
        <input type="text" name="name" value="" placeholder="City">
      </div>
      <div class="input-field col s6">
        <input type="text" name="name" value="" placeholder="Zip code">
      </div>
      <div class="input-field col s6">
        <input type="password" name="name" value="" placeholder="Password">
      </div>
      <div class="input-field col s12">
        <a class="waves-effect waves-light btn">Register</a>
      </div>
    </form>
  `
})

export class Register {
  register: string;
  constructor() {
    this.register = 'Register'
  }
}
