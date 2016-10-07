import { Component, Output, EventEmitter } from '@angular/core';

import { Tab } from './tab';

@Component({
  moduleId: module.id,
  selector: 'billing-tab-component',
  templateUrl: 'billing-tab.html'
})

export class BillingTabComponent extends Tab {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
}
