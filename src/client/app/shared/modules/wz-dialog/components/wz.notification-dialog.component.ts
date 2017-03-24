import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-notification-dialog',
  template: `
      <div layout="column" layout-align="space-between center" layout-margin layout-padding>
        <h1 md-dialog-title flex>{{ strings.title | translate }}</h1>
        <md-dialog-content flex>
          {{ strings.message | translate }}
        </md-dialog-content>
        <md-dialog-actions flex>
          <button md-button md-dialog-close color="primary" title="{{ strings.prompt | translate }}">
            {{ strings.prompt | translate }}
          </button>
        </md-dialog-actions>
      </div>
  `
})
export class WzNotificationDialogComponent {
  @Input() strings: any;
}
