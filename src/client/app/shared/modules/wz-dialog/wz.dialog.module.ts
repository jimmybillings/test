import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { WzFormModule } from '../wz-form/wz-form.module';

// Wrapper service
import { WzDialogService } from './services/wz.dialog.service';

// Dialog types
import {
  WzConfirmationDialogComponent,
  WzNotificationDialogComponent,
  WzFormDialogComponent,
} from './components/index';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    WzFormModule
  ],
  declarations: [
    WzNotificationDialogComponent,
    WzConfirmationDialogComponent,
    WzFormDialogComponent
  ],
  entryComponents: [
    WzNotificationDialogComponent,
    WzConfirmationDialogComponent,
    WzFormDialogComponent
  ],
  providers: [WzDialogService]
})
export class WzDialogModule { }
