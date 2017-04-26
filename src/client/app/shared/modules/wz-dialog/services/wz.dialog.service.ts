import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormFields } from '../../../../shared/interfaces/forms.interface';
import { MdDialogRef, MdDialog, MdDialogConfig, DialogPosition } from '@angular/material';

import {
  WzFormDialogComponent,
  WzNotificationDialogComponent,
  WzConfirmationDialogComponent
} from '../components/index';

import {
  DialogCallback,
  FormDialogOptions,
  DialogResultCallback,
  DialogNoResultCallback,
  NotifcationDialogStrings,
  defaultFormDialogOptions,
  ConfirmationDialogStrings,
  defaultConfirmationDialogOptions,
  defaultNotificationDialogOptions
} from '../interfaces/wz.dialog.interface';

@Injectable()
export class WzDialogService {
  constructor(private dialog: MdDialog) { }

  public openNotificationDialog(strings: NotifcationDialogStrings, config: MdDialogConfig = {}): Observable<any> {
    const newConfig: MdDialogConfig = Object.assign(defaultNotificationDialogOptions, config);
    const dialogRef: MdDialogRef<WzNotificationDialogComponent> = this.dialog.open(WzNotificationDialogComponent, newConfig);

    dialogRef.componentInstance.strings = strings;

    return dialogRef.afterClosed();
  }

  public openConfirmationDialog(
    strings: ConfirmationDialogStrings,
    config: MdDialogConfig,
    onAccept: DialogNoResultCallback,
    onDecline: DialogNoResultCallback = () => { }
  ): Observable<any> {
    const newConfig: MdDialogConfig = Object.assign(defaultConfirmationDialogOptions, config);
    const dialogRef: MdDialogRef<WzConfirmationDialogComponent> = this.dialog.open(WzConfirmationDialogComponent, newConfig);
    const component: WzConfirmationDialogComponent = dialogRef.componentInstance;

    dialogRef.componentInstance.strings = strings;

    this.setupCallbacks(component, dialogRef, [
      { event: 'accept', callback: onAccept, closeOnEvent: false },
      { event: 'decline', callback: onDecline, closeOnEvent: false }
    ]);

    return dialogRef.afterClosed();
  }

  public openFormDialog(
    formItems: FormFields[],
    options: FormDialogOptions,
    onSubmit: DialogResultCallback,
    onCancel: DialogNoResultCallback = () => { }
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

    this.setupCallbacks(component, dialogRef, [
      { event: 'submit', callback: onSubmit, closeOnEvent: true },
      { event: 'cancel', callback: onCancel, closeOnEvent: true }
    ]);

    return dialogRef.afterClosed();
  }

  private setupCallbacks(component: any, dialogRef: MdDialogRef<any>, callbacks: Array<DialogCallback>): void {
    callbacks.forEach((cb: DialogCallback) => {
      component[cb.event].subscribe((result?: any) => {
        if (cb.closeOnEvent) dialogRef.close();
        if (cb.callback) cb.callback(result);
      });
    });
  }
}
