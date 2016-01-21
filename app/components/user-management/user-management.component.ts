import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Login} from './login/login.component';
import {Register} from './register/register.component';

@Component({
  selector: 'user',
  template: '<router-outlet></router-outlet>',
  directives: ROUTER_DIRECTIVES
})

@RouteConfig([
  { path: '/register', component: Register, as: 'Register'},
  { path: '/login', component: Login, as: 'Login'}
])

export class User { 
  router: Router;
  constructor(router: Router) {
      this.router = router;
  }
}
