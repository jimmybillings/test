import {RouterConfig} from '@angular/router';
import {DashboardComponent} from './+dashboard/dashboard.component';
import {IndexComponent} from './+index/index.component';
import {NewComponent} from './+new/new.component';
import {EditComponent} from './+edit/edit.component';
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
  { path: 'resource/:resource', component: IndexComponent  },
  { path: 'secret-config/:site', component: SecretConfigComponent }
];