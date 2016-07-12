import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {CurrentUser} from '../shared/services/current-user.model';
import {AdminService} from './services/admin.service';
import {ConfigService} from './services/config.service';

@Component({
  moduleId: module.id,
  selector: 'admin',
  templateUrl: 'admin.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [ConfigService, AdminService]
})

export class AdminComponent {
  constructor(public currentUser: CurrentUser) {}
}
