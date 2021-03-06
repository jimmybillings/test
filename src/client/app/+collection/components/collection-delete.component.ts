import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'collection-delete-component',
  template: `<div class="wz-dialog">
    <h1 mat-dialog-title>{{ 'COLLECTION.INDEX.CONFIRMATION_TITLE' | translate:{collectionName: collection.name} }}</h1>
    <p class="dialog-summary">{{ 'COLLECTION.INDEX.CONFIRMATION_SUBTITLE' | translate }}</p>
    <mat-dialog-actions align="end" class="confirmation-buttons">
      <button mat-button color="primary" mat-dialog-close>
        {{ 'COLLECTION.INDEX.CONFIRMATION_CANCEL_BTN_TITLE' | translate }}
      </button>
      <button mat-button color="primary" mat-dialog-close (click)="deleteCollection()">
      {{ 'COLLECTION.INDEX.CONFIRMATION_DELETE_BTN_TITLE' | translate }}</button>
    </mat-dialog-actions>
	</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionDeleteComponent {
  @Output() deleteEvent: any = new EventEmitter();
  @Input() collection: any;

  public deleteCollection() {
    this.deleteEvent.emit({ type: 'DELETE_COLLECTION', payload: this.collection.id });
  }
}
