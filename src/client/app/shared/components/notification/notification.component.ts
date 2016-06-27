import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

/**
 * site header component - renders the header information
 */

export const notficationState:any = {
  NEW_USER: 'confirmed=true',
  EXPIRED_SESSION: 'loggedOut=true'
};

@Component({
  moduleId: module.id,
  selector: 'notification',
  template: '<div *ngIf="notice">{{notice | translate}}</div>',
  styles: [`div {
    position: fixed;
    top: 0;
    left: 0;
    height: 23px;
    z-index: 10000;
    width: 100%;
    background: white;
    text-align: center;
    margin-top: 42px;
    opacity: .5;
    background: darkorange; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [TranslatePipe]
})

export class NotificationComponent {
  @Input() notice: string;
}
