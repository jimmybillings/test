import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'notification',
  template: '<div class="notification" [ngClass]="theme"><p>{{notice | translate}}</p></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [TranslatePipe]
})

export class NotificationComponent {
  @Input() notice: string;
  @Input() theme: string;
}
