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
    if (Object.keys(changes).indexOf('state') !== -1) {
      this.checkStateChanges(changes.state);
    }
    if (Object.keys(changes).indexOf('UiState') !== -1) {
      this.checkUiStateChanges(changes.UiState);
    }
  }

  public checkStateChanges(changes: any): void {
    if (changes.currentValue.indexOf('confirmed=true') > 0) this.notice = 'Welcome New User!';
    if (changes.currentValue.indexOf('loggedOut=true') > 0) this.notice = 'Your session has expired and you must login again.';
  }

  public checkUiStateChanges(changes: any): void {
    if (changes.currentValue.message) {
      this.notice = changes.currentValue.message;
      this.type = changes.currentValue.type;
    } else {
      this.notice = null;
      this.type = null;
    }
  }
}
