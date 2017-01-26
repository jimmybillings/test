import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Project, LineItem } from '../../../shared/interfaces/cart.interface';

@Component({
  moduleId: module.id,
  selector: 'line-items-component',
  templateUrl: './line-items.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineItemsComponent {
  public targets: any = {};
  public items: LineItem[];
  @Input() set lineItems(stuff: LineItem[]) {
    stuff.forEach((item: LineItem, index: number) => {
      this.targets[index] = item.selectedTranscodeTarget;
    });
    this.items = stuff;
  };
  @Input() otherProjects: Project[];
  @Output() lineItemsNotify: EventEmitter<Object> = new EventEmitter<Object>();
  private selectedLineItem: LineItem;

  public moveTo(otherProject: Project, lineItem: LineItem): void {
    this.lineItemsNotify.emit(
      {
        type: 'MOVE_LINE_ITEM', payload: { lineItem: lineItem, otherProject: otherProject }
      });
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

  public selectLineItem(lineItem: LineItem) {
    this.selectedLineItem = lineItem;
  }

  public selectTarget(currentlySelected: string, newTarget: string, lineItem: LineItem): void {
    if (currentlySelected !== newTarget) {
      this.lineItemsNotify.emit(
        {
          type: 'EDIT_LINE_ITEM', payload:
          { lineItem, fieldToEdit: { selectedTranscodeTarget: newTarget } }
        });
    }
  }
}
