import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'collection-delete-component',
  template: `<div class="wz-dialog">
    <h1 md-dialog-title>{{ 'COLLECTION.INDEX.CONFIRMATION_TITLE' | translate:{collectionName: collection.name} }}</h1>
    <p class="dialog-summary">{{ 'COLLECTION.INDEX.CONFIRMATION_SUBTITLE' | translate }}</p>
    <md-dialog-actions align="end" class="confirmation-buttons">
      <button md-button color="primary" md-dialog-close>
        {{ 'COLLECTION.INDEX.CONFIRMATION_CANCEL_BTN_TITLE' | translate }}
      </button>
      <button md-button color="primary" md-dialog-close (click)="deleteCollection()">
      {{ 'COLLECTION.INDEX.CONFIRMATION_DELETE_BTN_TITLE' | translate }}</button>
    </md-dialog-actions>
	</div>`,
  styles: [
    '.wz-dialog{padding:0 5px 10px}'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionDeleteComponent {
  @Output() deleteEvent: any = new EventEmitter();;
  @Input() collection: any;

  public deleteCollection() {
    this.deleteEvent.emit({ type: 'DELETE_COLLECTION', payload: this.collection.id });
  }
}
