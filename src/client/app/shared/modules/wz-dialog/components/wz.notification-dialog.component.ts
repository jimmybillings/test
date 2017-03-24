import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-notification-dialog',
  template: `
    <h1 md-dialog-title>{{ strings.title | translate }}</h1>
    <md-dialog-content layout="row">
      <div flex>{{ strings.message | translate }}</div>
    </md-dialog-content>
    <md-dialog-actions layout="row" layout-align="end end">
      <button md-button md-dialog-close color="primary" title="{{ strings.prompt | translate }}">
        {{ strings.prompt | translate }}
      </button>
    </md-dialog-actions>
  `
})
export class WzNotificationDialogComponent {
  @Input() strings: any;
}
