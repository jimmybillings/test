import { Component, Output, EventEmitter } from '@angular/core';

import { Tab } from './tab';

@Component({
  moduleId: module.id,
  selector: 'review-tab-component',
  templateUrl: 'review-tab.html'
})

export class ReviewTabComponent extends Tab {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
}
