import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'payment-tab-component',
  templateUrl: 'payment-tab.html'
})

export class PaymentTabComponent {
  @Output() tabNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public goToNextTab(): void {
    this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
  }
}
