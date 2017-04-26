import { MdDialogConfig } from '@angular/material';

export interface FormDialogOptions {
  title?: string;
  submitLabel?: string;
  cancelLabel?: string;
  displayCancelButton?: boolean;
  autocomplete?: string;
  dialogConfig?: MdDialogConfig;
};

export interface NotifcationDialogStrings {
  title: string;
  message: string;
  prompt: string;
}

export interface ConfirmationDialogStrings {
  title: string;
  message: string;
  accept: string;
  decline: string;
}

export const defaultFormDialogOptions: FormDialogOptions = {
  title: undefined,
  submitLabel: 'Submit',
  cancelLabel: 'Cancel',
  displayCancelButton: false,
  autocomplete: 'on',
  dialogConfig: { disableClose: true, position: { top: '10%' } }
};

export const defaultConfirmationDialogOptions: MdDialogConfig = {
  disableClose: true, width: '375px', position: { top: '12%' }
};

export const defaultNotificationDialogOptions: MdDialogConfig = {
  disableClose: true, width: '375px', position: { top: '12%' }
};

export interface DialogCallback {
  event: string;
  callback: Function;
  closeOnEvent: boolean;
}

export type DialogResultCallback = (result: any) => void;
export type DialogNoResultCallback = () => void;

