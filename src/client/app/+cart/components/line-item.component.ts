import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Project, LineItem } from '../cart.interface';

@Component({
  moduleId: module.id,
  selector: 'line-item-component',
  styles: [`
    div {
      border: 1px solid black;
      margin: 0 20px;
      min-height: 100px;
      clear: both;
    }

    p {
      float: left;
      padding: 0 20px;
      margin: 20px 0 0 0;
      width: 200px;
    }

    p.buttons {
      float: right;
      width: 200px;
    }
  `],
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
