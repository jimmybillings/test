import {Component} from '@angular/core';
import {RouterConfig, ROUTER_DIRECTIVES} from '@angular/router';
import {CurrentUser} from '../shared/services/current-user.model';
import {DashboardComponent} from './+dashboard/dashboard.component';
import {IndexComponent} from './+index/index.component';
import {NewComponent} from './+new/new.component';
import {EditComponent} from './+edit/edit.component';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {ConfigComponent} from './+config/config.component';
import {UiConfigComponent} from './+ui-config/ui-config.component';
import {SiteConfigComponent} from './+site-config/site-config.component';
import {SecretConfigComponent} from './+secret-config/secret-config.component';

export const ADMIN_ROUTES: RouterConfig = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'ui-config/:site', component: UiConfigComponent },
  { path: 'site-config/:site', component: SiteConfigComponent },
  { path: 'resource/:resource/new', component: NewComponent },
  { path: 'resource/:resource/:id', component: EditComponent  },
  { path: 'resource/:resource', component: IndexComponent  }
];

@Component({
  moduleId: module.id,
  selector: 'admin',
  templateUrl: 'admin.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: [TranslatePipe]
})

<<<<<<< HEAD
=======
@Routes([
  { path: '/dashboard', component: DashboardComponent },
  { path: '/config', component: ConfigComponent },
  { path: '/secret-config/:site', component: SecretConfigComponent },
  { path: '/ui-config/:site', component: UiConfigComponent },
  { path: '/site-config/:site', component: SiteConfigComponent },
  { path: '/resource/:resource/new', component: NewComponent },
  { path: '/resource/:resource/:id', component: EditComponent  },
  { path: '/resource/:resource', component: IndexComponent  },
])

>>>>>>> fb3f00646e061c9647fb8d5c5d466c67b410bee8
export class AdminComponent {
  constructor(public currentUser: CurrentUser) {}
}
