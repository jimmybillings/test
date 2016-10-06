import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'review-tab-component',
  templateUrl: 'review-tab.html'
})

export class ReviewTabComponent {
  @Output() tabNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public goToNextTab(): void {
    this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
  }
}
