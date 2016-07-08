import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'notification',
  template: '<div class="notification" [ngClass]="theme"><p>{{notice | translate}}</p></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NotificationComponent {
  @Input() notice: string;
  @Input() theme: string;
}
