import { MdDialogConfig } from '@angular/material';

export interface DialogConfig {
  mergedDialogConfig: MdDialogConfig;
  mergedOptions: DialogOptions;
}

export interface BaseDialogConfig {
  dialogConfig?: MdDialogConfig;
}

export interface FormDialogOptions extends BaseDialogConfig {
  title?: string;
  submitLabel?: string;
  cancelLabel?: string;
  displayCancelButton?: boolean;
  autocomplete?: string;
};

export interface NotificationDialogOptions extends BaseDialogConfig {
  title?: string;
  message?: string;
  prompt?: string;
}

export interface ConfirmationDialogOptions extends BaseDialogConfig {
  title?: string;
  message?: string;
  accept?: string;
  decline?: string;
}

export interface NotificationDialogStrings {
  title?: string;
  message?: string;
  prompt?: string;
}

export interface ConfirmationDialogStrings {
  title?: string;
  message?: string;
  accept?: string;
  decline?: string;
}

export const defaultFormDialogOptions: FormDialogOptions = {
  title: undefined,
  submitLabel: 'Submit',
  cancelLabel: 'Cancel',
  displayCancelButton: false,
  autocomplete: 'on',
  dialogConfig: { disableClose: true, position: { top: '10%' } }
};

export const defaultConfirmationDialogOptions: ConfirmationDialogOptions = {
  dialogConfig: { disableClose: true, width: '375px', position: { top: '12%' } }
};

export const defaultNotificationDialogOptions: NotificationDialogOptions = {
  prompt: 'close', dialogConfig: { disableClose: true, width: '375px', position: { top: '12%' } }
};

export interface DialogCallback {
  event: string;
  callback: Function;
  closeOnEvent?: boolean;
}

export interface DefaultComponentOptions {
  componentType: any;
  dialogConfig?: MdDialogConfig;
  inputOptions?: { [index: string]: any };
  outputOptions?: Array<DialogCallback>;
};

export type DialogOptions = FormDialogOptions | ConfirmationDialogOptions | NotificationDialogOptions;
export type DialogResultCallback = (result: any) => void;
export type DialogNoResultCallback = () => void;

