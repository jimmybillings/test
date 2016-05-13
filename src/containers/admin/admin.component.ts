import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {CurrentUser} from '../../common/models/current-user.model';
import {Dashboard} from './dashboard/dashboard.component';
import {Index} from './index/index.component';
import { Config} from './config/config.component';

@Component({
  selector: 'admin',
  templateUrl: 'containers/admin/admin.html',
  directives: ROUTER_DIRECTIVES
})

@RouteConfig([
  { path: '/dashboard', component: Dashboard, name: 'Dashboard' },
  { path: '/accounts', component: Index, name: 'Account' },
  { path: '/users', component: Index, name: 'User' },
  { path: '/config', component: Config, name: 'Config' }
])

export class Admin {
  public currentUser: CurrentUser;
  public resource: string;
    
  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
}
