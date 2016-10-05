import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Project, LineItem } from '../cart.interface';

@Component({
  moduleId: module.id,
  selector: 'line-items-component',
  templateUrl: './line-items.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LineItemsComponent {
  @Input() lineItems: LineItem[];
  @Input() otherProjects: Project[];
  @Output() lineItemsNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public moveTo(otherProject: Project, lineItem: LineItem): void {
    this.lineItemsNotify.emit({ type: 'MOVE_LINE_ITEM', payload: { lineItem: lineItem, otherProject: otherProject } });
  }

  public clone(lineItem: LineItem): void {
    this.lineItemsNotify.emit({ type: 'CLONE_LINE_ITEM', payload: lineItem });
  }

  public remove(lineItem: LineItem): void {
    this.lineItemsNotify.emit({ type: 'REMOVE_LINE_ITEM', payload: lineItem });
  }

  public delegate(message: any): void {
    this.lineItemsNotify.emit(message);
  }
}
