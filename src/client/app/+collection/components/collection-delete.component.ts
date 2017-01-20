import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'collection-delete-component',
  template: `<div class="wz-dialog">
		<md-card>
			<md-card-title>{{ 'COLLECTION.INDEX.CONFIRMATION_TITLE' | translate:{collectionName: collection.name} }}</md-card-title>
			<md-card-subtitle>{{ 'COLLECTION.INDEX.CONFIRMATION_SUBTITLE' | translate }}</md-card-subtitle>
			<md-card-actions align="end" class="confirmation-buttons">
				<button md-button color="primary" (click)="dialog.close()">
          {{ 'COLLECTION.INDEX.CONFIRMATION_CANCEL_BTN_TITLE' | translate }}
        </button>
				<button md-button color="primary" (click)="dialog.close(collection.id)">
        {{ 'COLLECTION.INDEX.CONFIRMATION_DELETE_BTN_TITLE' | translate }}</button>
			</md-card-actions>
		</md-card>
	</div>`,
  styles: [
    '.wz-dialog{padding:6px 7px 13px} md-card{ box-shadow: none; padding: 0;}'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionDeleteComponent {
  @Input() dialog: any;
  @Input() collection: any;
}
