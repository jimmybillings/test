import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdDialogRef, MdDialog, MdDialogConfig, DialogPosition } from '@angular/material';

import { WzNotificationDialogComponent } from '../components/wz.notification-dialog.component';
import { WzFormDialogComponent } from '../components/wz.form-dialog.component';
import {
  FormDialogOptions, defaultFormDialogOptions, FormDialogSubmitCallback, FormDialogCancelCallback
} from '../interfaces/wz.dialog.interface';
import { FormFields } from '../../../../shared/interfaces/forms.interface';

@Injectable()
export class WzDialogService {
  constructor(private dialog: MdDialog) { }

  public openNotification(strings: any = {}, config: MdDialogConfig = {}): Observable<any> {
    Object.assign(config, { disableClose: true, width: '375px', position: { top: '12%' } });
    let dialogRef: MdDialogRef<any> = this.dialog.open(WzNotificationDialogComponent, config);
    dialogRef.componentInstance.strings = strings;
    return dialogRef.afterClosed();
  }

  public openFormDialog(
    formItems: FormFields[],
    options: FormDialogOptions,
    onSubmit: FormDialogSubmitCallback,
    onCancel: FormDialogCancelCallback = () => { }
  ): Observable<any> {
    const mergedDialogPosition: DialogPosition =
      Object.assign({}, (defaultFormDialogOptions.dialogConfig || {}).position, (options.dialogConfig || {}).position);

    const mergedDialogConfig: MdDialogConfig =
      Object.assign({}, defaultFormDialogOptions.dialogConfig, options.dialogConfig, { position: mergedDialogPosition });

    const mergedOptions: FormDialogOptions = Object.assign({}, defaultFormDialogOptions, options);

    const dialogRef: MdDialogRef<WzFormDialogComponent> = this.dialog.open(WzFormDialogComponent, mergedDialogConfig);
    const component: WzFormDialogComponent = dialogRef.componentInstance;

    component.formItems = formItems;
    component.title = mergedOptions.title;
    component.cancelLabel = mergedOptions.cancelLabel;
    component.submitLabel = mergedOptions.submitLabel;
    component.displayCancelButton = mergedOptions.displayCancelButton;
    component.autocomplete = mergedOptions.autocomplete;

    component.submit.subscribe((result: any) => {
      dialogRef.close();
      if (onSubmit) onSubmit(result);
    });

    component.cancel.subscribe(() => {
      dialogRef.close();
      if (onCancel) onCancel();
    });

    return dialogRef.afterClosed();
  }
}
