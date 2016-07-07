import {RouterConfig} from '@angular/router';
import {DashboardComponent} from './+dashboard/dashboard.component';
import {IndexComponent} from './+index/index.component';
import {NewComponent} from './+new/new.component';
import {EditComponent} from './+edit/edit.component';
import {ConfigComponent} from './+config/config.component';
import {UiConfigComponent} from './+ui-config/ui-config.component';
import {SiteConfigComponent} from './+site-config/site-config.component';
import {SecretConfigComponent} from './+secret-config/secret-config.component';
import {AdminAuthGuard} from './services/admin.auth.guard';

export const ADMIN_ROUTES: RouterConfig = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AdminAuthGuard] },
  { path: 'config', component: ConfigComponent, canActivate: [AdminAuthGuard] },
  { path: 'ui-config/:site', component: UiConfigComponent, canActivate: [AdminAuthGuard] },
  { path: 'site-config/:site', component: SiteConfigComponent, canActivate: [AdminAuthGuard] },
  { path: 'resource/:resource/new', component: NewComponent, canActivate: [AdminAuthGuard] },
  { path: 'resource/:resource/:id', component: EditComponent, canActivate: [AdminAuthGuard] },
  { path: 'resource/:resource', component: IndexComponent, canActivate: [AdminAuthGuard] },
  { path: 'secret-config/:site', component: SecretConfigComponent, canActivate: [AdminAuthGuard] }
];
