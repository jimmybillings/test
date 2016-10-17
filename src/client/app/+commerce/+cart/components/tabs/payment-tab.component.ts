import { Component, Output, EventEmitter } from '@angular/core';

import { Tab } from './tab';

@Component({
  moduleId: module.id,
  selector: 'payment-tab-component',
  templateUrl: 'payment-tab.html'
})

export class PaymentTabComponent extends Tab {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
}
