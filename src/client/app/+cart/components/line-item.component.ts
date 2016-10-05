import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Project, LineItem } from '../cart.interface';

@Component({
  moduleId: module.id,
  selector: 'line-item-component',
  templateUrl: 'line-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LineItemComponent {
  @Input() lineItem: LineItem;
  @Input() otherProjects: Project[];
  @Output() lineItemNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public moveLineItemTo(otherProject: Project): void {
    this.lineItemNotify.emit({ type: 'MOVE_LINE_ITEM', payload: { lineItem: this.lineItem, otherProject: otherProject } });
  }

  public cloneLineItem(): void {
    this.lineItemNotify.emit({ type: 'CLONE_LINE_ITEM', payload: this.lineItem });
  }

  public removeLineItem(): void {
    this.lineItemNotify.emit({ type: 'REMOVE_LINE_ITEM', payload: this.lineItem });
  }
}
