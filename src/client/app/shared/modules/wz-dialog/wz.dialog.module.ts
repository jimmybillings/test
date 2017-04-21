import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { WzFormModule } from '../wz-form/wz-form.module';

// Wrapper service
import { WzDialogService } from './services/wz.dialog.service';

// Dialog types
import { WzNotificationDialogComponent } from './components/wz.notification-dialog.component';
import { WzFormDialogComponent } from './components/wz.form-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    WzFormModule
  ],
  declarations: [
    WzNotificationDialogComponent,
    WzFormDialogComponent
  ],
  entryComponents: [
    WzNotificationDialogComponent,
    WzFormDialogComponent
  ],
  providers: [WzDialogService]
})
export class WzDialogModule { }
