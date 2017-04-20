import { MdDialogConfig } from '@angular/material';

export interface FormDialogOptions {
  title?: string;
  submitLabel?: string;
  cancelLabel?: string;
  displayCancelButton?: boolean;
  autocomplete?: string;
  dialogConfig?: MdDialogConfig;
};

export const defaultFormDialogOptions: FormDialogOptions = {
  title: undefined,
  submitLabel: 'Submit',
  cancelLabel: 'Cancel',
  displayCancelButton: false,
  autocomplete: 'on',
  dialogConfig: { disableClose: true, position: { top: '10%' } }
};

export type FormDialogSubmitCallback = (result: any) => void;
export type FormDialogCancelCallback = () => void;
