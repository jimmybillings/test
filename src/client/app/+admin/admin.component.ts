import {Component} from '@angular/core';
import {Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {CurrentUser} from '../shared/services/current-user.model';
import {DashboardComponent} from './+dashboard/dashboard.component';
import {IndexComponent} from './+index/index.component';
import {NewComponent} from './+new/new.component';
import {ConfigComponent} from './+config/config.component';
import {UiConfigComponent} from './+ui-config/ui-config.component';
import {SiteConfigComponent} from './+site-config/site-config.component';

@Component({
  selector: 'admin',
  templateUrl: 'app/+admin/admin.html',
  directives: [ROUTER_DIRECTIVES]
})

@Routes([
  { path: '/dashboard', component: DashboardComponent },
  { path: '/config', component: ConfigComponent },
  { path: '/ui-config/:site', component: UiConfigComponent },
  { path: '/site-config/:site', component: SiteConfigComponent },
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
