import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'admin-dashboard',
  templateUrl: 'containers/admin/dashboard/dashboard.html',
  directives: ROUTER_DIRECTIVES
})

/**
 * Dashboard Component - Creates an admin dashboard. It is instantiated with the current user
 */
export class Dashboard {
  public currentUser: CurrentUser;
  
  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
}
