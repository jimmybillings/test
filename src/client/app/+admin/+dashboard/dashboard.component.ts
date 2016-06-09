import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {CurrentUser} from '../../shared/services/current-user.model';

@Component({
  moduleId: module.id,
  selector: 'admin-dashboard',
  templateUrl: 'dashboard.html',
  pipes: [TranslatePipe]
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
