import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationDialogStrings, TrString } from '../interfaces/wz.dialog.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-confirmation-dialog',
  template: `
    <ng-container *ngIf="stringHasValues(strings.title); else staticTitle">
      <h1 mat-dialog-title>{{ strings.title.key | translate:strings.message.values }}</h1>
    </ng-container>
    <ng-template #staticTitle>
      <h1 mat-dialog-title>{{ strings.title | translate }}</h1>
    </ng-template>
    <mat-dialog-content layout="row">
      <ng-container *ngIf="stringHasValues(strings.message); else staticMessage">
        <div flex>{{ strings.message.key | translate:strings.message.values }}</div>
      </ng-container>
      <ng-template #staticMessage>
        <div flex>{{ strings.message | translate }}</div>
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions layout="row" layout-align="end end">
      <button (click)="onClickDecline()" mat-button mat-dialog-close color="primary">
        {{ strings.decline | translate }}
      </button>
      <button (click)="onClickAccept()" mat-button mat-dialog-close color="primary">
        {{ strings.accept | translate }}
      </button>
    </mat-dialog-actions>
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

  public stringHasValues(s: string | TrString) {
    return s.hasOwnProperty('key') && s.hasOwnProperty('values');
  }
}
