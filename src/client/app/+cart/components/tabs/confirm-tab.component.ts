import { Component, Output, EventEmitter } from '@angular/core';

import { Tab } from './tab';

@Component({
  moduleId: module.id,
  selector: 'confirm-tab-component',
  templateUrl: 'confirm-tab.html'
})

export class ConfirmTabComponent extends Tab {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
}
