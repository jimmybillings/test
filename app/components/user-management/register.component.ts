import {Component} from 'angular2/core';
import { MyService } from '../../services/sampleService';

@Component({
  selector: 'register',
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
