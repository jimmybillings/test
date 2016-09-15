import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { ConfigComponent } from './+config/config.component';
import { DashboardComponent } from './+dashboard/dashboard.component';
import { IndexComponent } from './+index/index.component';
import { SecretConfigComponent } from './+secret-config/secret-config.component';
import { TranslationComponent } from './+translation/translation.component';
import { SiteConfigComponent } from './+site-config/site-config.component';
import { UiConfigComponent } from './+ui-config/ui-config.component';
import { SharedModule } from '../shared/shared.module';
import { AdminService} from './services/admin.service';
import { ConfigService} from './services/config.service';
import { TranslateService} from './services/translate.service';
import { ADMIN_ROUTES } from './admin.routes';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from './services/admin.auth.guard';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(ADMIN_ROUTES)],
  declarations: [
    AdminComponent,
    ConfigComponent,
    DashboardComponent,
    IndexComponent,
    SecretConfigComponent,
    TranslationComponent,
    SiteConfigComponent,
    UiConfigComponent],
  exports: [AdminComponent],
  providers: [AdminService, ConfigService, TranslateService, AdminAuthGuard],
})

export class AdminModule { }
