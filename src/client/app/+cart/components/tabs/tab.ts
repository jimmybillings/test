import { EventEmitter } from '@angular/core';

export class Tab {
  // Inject "notify" for specs, but let it default for real code
  constructor(public notify: EventEmitter<Object> = new EventEmitter<Object>()) {}

  public goToPreviousTab(): void {
    this.notify.emit({ type: 'GO_TO_PREVIOUS_TAB' });
  }

  public goToNextTab(): void {
    this.notify.emit({ type: 'GO_TO_NEXT_TAB' });
  }
}
