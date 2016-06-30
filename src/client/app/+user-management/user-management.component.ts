import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import { User } from './services/user.data.service';

@Component({
  moduleId: module.id,
  selector: 'user',
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES],
  providers: [User]
})

export class UserManagementComponent {}
