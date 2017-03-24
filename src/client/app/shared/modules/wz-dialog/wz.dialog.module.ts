import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { TranslateModule } from 'ng2-translate';

// Wrapper service
import { WzDialogService } from './services/wz.dialog.service';

// Dialog types
import { WzNotificationDialogComponent } from './components/wz.notification-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [
    WzNotificationDialogComponent
  ],
  exports: [
    WzNotificationDialogComponent
  ],
  entryComponents: [
    WzNotificationDialogComponent
  ],
  providers: [WzDialogService]
})
export class WzDialogModule { }
