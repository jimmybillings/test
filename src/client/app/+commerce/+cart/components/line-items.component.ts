import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Project, LineItem } from '../../../shared/interfaces/cart.interface';
import { Capabilities } from '../../../shared/services/capabilities.service';

@Component({
  moduleId: module.id,
  selector: 'line-items-component',
  templateUrl: './line-items.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineItemsComponent {
  public targets: any = {};
  public items: LineItem[];
  @Input() set lineItems(items: LineItem[]) {
    if (items) {
      items.forEach((item: LineItem, index: number) => {
        this.targets[index] = item.selectedTranscodeTarget;
      });
      this.items = items;
    }
  };
  @Input() otherProjects: Project[];
  @Input() userCan: Capabilities;
  @Output() lineItemsNotify: EventEmitter<Object> = new EventEmitter<Object>();
  public selectedLineItem: LineItem;

  public moveTo(otherProject: Project, lineItem: LineItem): void {
    this.lineItemsNotify.emit({
      type: 'MOVE_LINE_ITEM', payload: { lineItem: lineItem, otherProject: otherProject }
    });
  }

  public clone(lineItem: LineItem): void {
    this.lineItemsNotify.emit({ type: 'CLONE_LINE_ITEM', payload: lineItem });
  }

  public remove(lineItem: LineItem): void {
    this.lineItemsNotify.emit({ type: 'REMOVE_LINE_ITEM', payload: lineItem });
  }

  public editMarkers(lineItem: LineItem): void {
    this.lineItemsNotify.emit({ type: 'EDIT_LINE_ITEM_MARKERS', payload: lineItem });
  }

  public delegate(message: any): void {
    this.lineItemsNotify.emit(message);
  }

  public selectLineItem(lineItem: LineItem) {
    this.selectedLineItem = lineItem;
  }

  public showPricingDialog(lineItem: LineItem): void {
    this.lineItemsNotify.emit({ type: 'SHOW_PRICING_DIALOG', payload: lineItem });
  }

  public selectTarget(currentlySelected: string, newTarget: string, lineItem: LineItem): void {
    if (currentlySelected !== newTarget) {
      this.lineItemsNotify.emit({
        type: 'EDIT_LINE_ITEM', payload:
        { lineItem, fieldToEdit: { selectedTranscodeTarget: newTarget } }
      });
    }
  }
}
