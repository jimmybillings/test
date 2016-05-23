import {Component} from '@angular/core';
import {Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {CurrentUser} from '../shared/services/current-user.model';
import {DashboardComponent} from './+dashboard/dashboard.component';
import {IndexComponent} from './+index/index.component';
import {NewComponent} from './+new/new.component';
import {ConfigComponent} from './+config/config.component';
import {EditConfigComponent} from './+config/edit-config.component';

@Component({
  selector: 'admin',
  templateUrl: 'app/+admin/admin.html',
  directives: [ROUTER_DIRECTIVES]
})

@Routes([
  { path: '/dashboard', component: DashboardComponent },
  { path: '/config', component: ConfigComponent },
  { path: '/ui-config/:site', component: EditConfigComponent },
  { path: '/site-config/:site', component: EditConfigComponent },
  { path: '/resource/:resource/new', component: NewComponent },
  { path: '/resource/:resource', component: IndexComponent  },
])

export class AdminComponent {
  public currentUser: CurrentUser;
  public resource: string;

  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
}
