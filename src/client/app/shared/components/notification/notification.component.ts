import {Component, ChangeDetectionStrategy, Input, OnChanges} from '@angular/core';
/**
 * site header component - renders the header information
 */
@Component({
  selector: 'notification',
  template: '<div *ngIf="notice">{{notice}}</div>',
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
})

export class NotificationComponent implements OnChanges {
  @Input() state: string;
  @Input() currentUser: Object;
  public notice: string;
  constructor() {
    this.notice = null;
  }
  ngOnChanges(changes: any) {
    this.notice = null;
    if (Object.keys(changes).indexOf('state') !== -1) {
      if (changes.state.currentValue.indexOf('confirmed=true') > 0) this.notice = 'Welcome New User!';
      if (changes.state.currentValue.indexOf('loggedOut=true') > 0) this.notice = 'Your session has expired and you must login again.';
    }


  }
}
