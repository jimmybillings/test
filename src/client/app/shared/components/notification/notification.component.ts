import {Component, ChangeDetectionStrategy, Input, OnChanges} from '@angular/core';
/**
 * site header component - renders the header information
 */
@Component({
  moduleId: module.id,
  selector: 'notification',
  templateUrl: 'notification.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NotificationComponent implements OnChanges {
  @Input() state: string;
  @Input() UiState: any;

  public notice: string;
  public type: string;

  constructor() {
    this.notice = null;
    this.type = null;
  }

  ngOnChanges(changes: any) {
    if (changes.UiState.currentValue) {
      this.notice = changes.UiState.currentValue.message;
      this.type = changes.UiState.currentValue.type;
    } else {
      this.notice = null;
      this.type = null;
    }
    if (Object.keys(changes).indexOf('state') !== -1) {
      if (changes.state.currentValue.indexOf('confirmed=true') > 0) this.notice = 'Welcome New User!';
      if (changes.state.currentValue.indexOf('loggedOut=true') > 0) this.notice = 'Your session has expired and you must login again.';
    }
  }
}
