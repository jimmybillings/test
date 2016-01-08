import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {Login} from './login.component';
import {Component, View} from 'angular2/core';


describe('Login Component', () => {

  beforeEachProviders(() => []);
  it('Excepts a object containing a email and password', () => {
    login.signup({email: 'james_billings@me.com', password: '12345678'})
  });

});

/** Test component that contains an MdButton. */
@Component({
  selector: 'test-app',
  directives: [Login],
  template:
      `<button md-button type="button" (click)="increment()" [disabled]="isDisabled">Go</button>`,
})
class TestApp {
  clickCount: number = 0;
  isDisabled: boolean = false;

  increment() {
    this.clickCount++;
  }
}
