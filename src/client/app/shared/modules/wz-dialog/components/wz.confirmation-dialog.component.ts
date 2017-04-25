import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-confirmation-dialog',
  template: `
    <h1 md-dialog-title>{{ strings.title | translate }}</h1>
    <md-dialog-content layout="row">
      <div flex>{{ strings.message | translate }}</div>
    </md-dialog-content>
    <md-dialog-actions layout="row" layout-align="end end">
      <button (click)="accept.emit()" md-button md-dialog-close color="primary" title="{{ strings.accept | translate }}">
        {{ strings.accept | translate }}
      </button>
      <button (click)="decline.emit()" md-button md-dialog-close color="primary" title="{{ strings.decline | translate }}">
        {{ strings.decline | translate }}
      </button>
    </md-dialog-actions>
  `
})
export class WzConfirmationDialogComponent {
  @Input() strings: any;
  @Output() accept: EventEmitter<any> = new EventEmitter();
  @Output() decline: EventEmitter<any> = new EventEmitter();
}
