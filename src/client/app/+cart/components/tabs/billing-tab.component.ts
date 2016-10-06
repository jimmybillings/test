import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'billing-tab-component',
  templateUrl: 'billing-tab.html'
})

export class BillingTabComponent {
  @Output() tabNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public goToNextTab(): void {
    this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
  }
}
