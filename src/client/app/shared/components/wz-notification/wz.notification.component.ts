import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-notification',
  template:
  `<div class="notification" [ngClass]="theme">
      <p>{{notice | translate}}</p>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class WzNotificationComponent {
  @Input() notice: string;
  @Input() theme: string;
}
