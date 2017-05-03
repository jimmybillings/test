import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationDialogStrings } from '../interfaces/wz.dialog.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-confirmation-dialog',
  template: `
    <h1 md-dialog-title>{{ strings.title | translate }}</h1>
    <md-dialog-content layout="row">
      <div flex>{{ strings.message | translate }}</div>
    </md-dialog-content>
    <md-dialog-actions layout="row" layout-align="end end">
      <button (click)="onClickDecline()" md-button md-dialog-close color="primary">
        {{ strings.decline | translate }}
      </button>
      <button (click)="onClickAccept()" md-button md-dialog-close color="primary">
        {{ strings.accept | translate }}
      </button>
    </md-dialog-actions>
  `
})
export class WzConfirmationDialogComponent {
  @Input() strings: ConfirmationDialogStrings;
  @Output() accept: EventEmitter<null> = new EventEmitter();
  @Output() decline: EventEmitter<null> = new EventEmitter();

  public onClickAccept(): void {
    this.accept.emit();
  }

  public onClickDecline(): void {
    this.decline.emit();
  }
}
