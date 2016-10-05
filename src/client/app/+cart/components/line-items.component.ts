import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Project, LineItem } from '../cart.interface';

@Component({
  moduleId: module.id,
  selector: 'line-items-component',
  template: `
    <line-item-component *ngFor="let lineItem of lineItems" [lineItem]="lineItem" [otherProjects]="otherProjects" (lineItemNotify)="delegate($event)"></line-item-component>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LineItemsComponent {
  @Input() lineItems: LineItem[];
  @Input() otherProjects: Project[];
  @Output() lineItemsNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public delegate(message: any): void {
    this.lineItemsNotify.emit(message);
  }
}
