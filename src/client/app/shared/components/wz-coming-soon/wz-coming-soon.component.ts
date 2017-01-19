import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-coming-soon',
  template: `<md-card>
    <md-card-title>Coming Soon!</md-card-title>
    <md-card-subtitle>Apologies!! This feature has not been implemented yet. Please keep checking for it.</md-card-subtitle>
    <md-card-actions align="end" class="confirmation-buttons">
      <button md-button color="primary" (click)="dialog.close()">Close</button>
    </md-card-actions>
  </md-card>`,
  styles: [
    'md-card{ box-shadow: none; padding: 0; height: 50px;}'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzComingSoonComponent {

}
