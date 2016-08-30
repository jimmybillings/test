import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { ConfigComponent } from './+config/config.component';
import { DashboardComponent } from './+dashboard/dashboard.component';
import { IndexComponent } from './+index/index.component';
import { SecretConfigComponent } from './+secret-config/secret-config.component';
import { SiteConfigComponent } from './+site-config/site-config.component';
import { UiConfigComponent } from './+ui-config/ui-config.component';
import { SharedModule } from '../shared/shared.module';
import { AdminService} from './services/admin.service';
import { ConfigService} from './services/config.service';
import { ADMIN_ROUTES } from './admin.routes';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from './services/admin.auth.guard';

@NgModule({
  imports: [SharedModule.forRoot(), RouterModule.forChild(ADMIN_ROUTES)],
  declarations: [
    AdminComponent,
    ConfigComponent,
    DashboardComponent,
    IndexComponent,
    SecretConfigComponent,
    SiteConfigComponent,
    UiConfigComponent],
  exports: [AdminComponent],
  providers: [AdminService, ConfigService, AdminAuthGuard],
})

export class AdminModule { }
