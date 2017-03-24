import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

import { WzNotificationDialogComponent } from '../components/wz.notification-dialog.component';

@Injectable()
export class WzDialogService {
  constructor(private dialog: MdDialog) { }

  public openNotification(strings: any = {}, config: MdDialogConfig = {}): Observable<any> {
    Object.assign(config, { disableClose: true, width: '375px', position: { top: '12%' } });
    let dialogRef: MdDialogRef<any> = this.dialog.open(WzNotificationDialogComponent, config);
    dialogRef.componentInstance.strings = strings;
    return dialogRef.afterClosed();
  }
}
