import {Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {DashboardComponent} from './+dashboard/dashboard.component';
import {IndexComponent} from './+index/index.component';
import {ConfigComponent} from './+config/config.component';
import {UiConfigComponent} from './+ui-config/ui-config.component';
import {SiteConfigComponent} from './+site-config/site-config.component';
import {SecretConfigComponent} from './+secret-config/secret-config.component';
import {TranslationComponent} from './+translation/translation.component';
import { AdminAuthGuard } from './services/admin.auth.guard';

export const ADMIN_ROUTES: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [AdminAuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: 'config', component: ConfigComponent},
      { path: 'ui-config/:site', component: UiConfigComponent },
      { path: 'site-config/:site', component: SiteConfigComponent },
      { path: 'resource/account', component: IndexComponent },
      { path: 'resource/user', component: IndexComponent },
      { path: 'secret-config/:site', component: SecretConfigComponent },
      { path: 'translations/:site/:lang', component: TranslationComponent }
    ]}
];
