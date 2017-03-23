import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Project, LineItem } from '../../../../shared/interfaces/cart.interface';
import { Capabilities } from '../../../../shared/services/capabilities.service';
import { PurchaseType } from '../../../../shared/interfaces/quote.interface';

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
  @Input() quoteType: PurchaseType;
  @Input() otherProjects: Project[];
  @Input() userCan: Capabilities;
  @Output() lineItemsNotify: EventEmitter<Object> = new EventEmitter<Object>();
  public selectedLineItem: LineItem;

  public onMoveTo(otherProject: Project, lineItem: LineItem): void {
    this.lineItemsNotify.emit({
      type: 'MOVE_LINE_ITEM', payload: { lineItem: lineItem, otherProject: otherProject }
    });
  }

  public onClone(lineItem: LineItem): void {
    this.lineItemsNotify.emit({ type: 'CLONE_LINE_ITEM', payload: lineItem });
  }

  public onRemove(lineItem: LineItem): void {
    this.lineItemsNotify.emit({ type: 'REMOVE_LINE_ITEM', payload: lineItem });
  }

  public onEditMarkers(lineItem: LineItem): void {
    this.lineItemsNotify.emit({ type: 'EDIT_LINE_ITEM_MARKERS', payload: lineItem });
  }

  public delegate(message: any): void {
    this.lineItemsNotify.emit(message);
  }

  public selectLineItem(lineItem: LineItem) {
    this.selectedLineItem = lineItem;
  }

  public onShowPricingDialog(lineItem: LineItem): void {
    this.lineItemsNotify.emit({ type: 'SHOW_PRICING_DIALOG', payload: lineItem });
  }

  public onSelectTarget(newTarget: string, currentlySelected: string, lineItem: LineItem): void {
    if (currentlySelected !== newTarget) {
      this.lineItemsNotify.emit({
        type: 'EDIT_LINE_ITEM', payload:
        { lineItem, fieldToEdit: { selectedTranscodeTarget: newTarget } }
      });
    }
  }

  public shouldShowTargets(lineItem: LineItem): boolean {
    return lineItem.transcodeTargets && lineItem.transcodeTargets.length > 0;
  }
}
