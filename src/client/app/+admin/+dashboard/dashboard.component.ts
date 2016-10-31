import { Component } from '@angular/core';
import { CurrentUser } from '../../shared/services/current-user.model';

@Component({
  moduleId: module.id,
  selector: 'admin-dashboard',
  templateUrl: 'dashboard.html'
})

/**
 * Dashboard Component - Creates an admin dashboard. It is instantiated with the current user
 */
export class DashboardComponent {
  constructor(public currentUser: CurrentUser) { }
}
