import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'collection-delete-component',
  template: `<div class="wz-dialog">
    <h1 md-dialog-title>{{ 'COLLECTION.INDEX.CONFIRMATION_TITLE' | translate:{collectionName: collection.name} }}</h1>
    <p class="dialog-summary">{{ 'COLLECTION.INDEX.CONFIRMATION_SUBTITLE' | translate }}</p>
    <md-dialog-actions align="end" class="confirmation-buttons">
      <button md-button color="primary" (click)="dialog.close()">
        {{ 'COLLECTION.INDEX.CONFIRMATION_CANCEL_BTN_TITLE' | translate }}
      </button>
      <button md-button color="primary" (click)="dialog.close(collection.id)">
      {{ 'COLLECTION.INDEX.CONFIRMATION_DELETE_BTN_TITLE' | translate }}</button>
    </md-dialog-actions>
	</div>`,
  styles: [
    '.wz-dialog{padding:0 5px 10px}'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionDeleteComponent {
  @Input() dialog: any;
  @Input() collection: any;
}
