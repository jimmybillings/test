import {Component} from '@angular/core';
import {CurrentUser} from '../../shared/services/current-user.model';

@Component({
  selector: 'admin-dashboard',
  templateUrl: 'app/+admin/+dashboard/dashboard.html'
})

/**
 * Dashboard Component - Creates an admin dashboard. It is instantiated with the current user
 */
export class DashboardComponent {
  public currentUser: CurrentUser;

  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
}
