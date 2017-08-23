import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Project, AssetLineItem, QuoteType } from '../../../shared/interfaces/commerce.interface';
import { Capabilities } from '../../../shared/services/capabilities.service';
import { enhanceAsset, EnhancedAsset } from '../../../shared/interfaces/enhanced-asset';

@Component({
  moduleId: module.id,
  selector: 'line-items-component',
  templateUrl: './line-items.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineItemsComponent {
  public targets: any = {};
  public enhancedAssets: { [lineItemId: string]: EnhancedAsset } = {};
  public items: AssetLineItem[];

  @Input() set lineItems(items: AssetLineItem[]) {
    if (items) {
      items.forEach((item: AssetLineItem, index: number) => {
        this.targets[index] = item.selectedTranscodeTarget;
        this.enhancedAssets[item.id] = enhanceAsset(item.asset);
      });
      this.items = items;
    }
  };
  @Input() quoteType: QuoteType;
  @Input() otherProjects: Project[];
  @Input() userCan: Capabilities;
  @Input() readOnly: boolean = false;
  @Output() lineItemsNotify: EventEmitter<Object> = new EventEmitter<Object>();
  public selectedLineItem: AssetLineItem;

  public onMoveTo(otherProject: Project, lineItem: AssetLineItem): void {
    this.lineItemsNotify.emit({
      type: 'MOVE_LINE_ITEM', payload: { lineItem: lineItem, otherProject: otherProject }
    });
  }

  public onClone(lineItem: AssetLineItem): void {
    this.lineItemsNotify.emit({ type: 'CLONE_LINE_ITEM', payload: lineItem });
  }

  public onRemove(lineItem: AssetLineItem): void {
    this.lineItemsNotify.emit({ type: 'REMOVE_LINE_ITEM', payload: lineItem });
  }

  public onEditMarkers(lineItem: AssetLineItem): void {
    this.lineItemsNotify.emit({ type: 'EDIT_LINE_ITEM_MARKERS', payload: lineItem });
  }

  public delegate(message: any): void {
    this.lineItemsNotify.emit(message);
  }

  public selectLineItem(lineItem: AssetLineItem) {
    this.selectedLineItem = lineItem;
  }

  public onShowPricingDialog(lineItem: AssetLineItem): void {
    this.lineItemsNotify.emit({ type: 'SHOW_PRICING_DIALOG', payload: lineItem });
  }

  public onSelectTarget(newTarget: string, currentlySelected: string, lineItem: AssetLineItem): void {
    if (currentlySelected !== newTarget) {
      this.lineItemsNotify.emit({
        type: 'EDIT_LINE_ITEM', payload:
        { lineItem, fieldToEdit: { selectedTranscodeTarget: newTarget } }
      });
    }
  }

  public shouldShowTargets(lineItem: AssetLineItem): boolean {
    return lineItem.transcodeTargets && lineItem.transcodeTargets.length > 0;
  }

  public get shouldDisplayPricing(): boolean {
    return this.quoteType !== 'ProvisionalOrder';
  }

  public onOpenCostMultiplierForm(lineItem: AssetLineItem): void {
    this.lineItemsNotify.emit({ type: 'SHOW_COST_MULTIPLIER_DIALOG', payload: lineItem });
  }

  public onRemoveCostMultiplier(lineItem: AssetLineItem): void {
    this.lineItemsNotify.emit({ type: 'REMOVE_COST_MULTIPLIER', payload: lineItem });
  }

  public isSubclipped(lineItem: AssetLineItem): boolean {
    return this.enhancedAssets[lineItem.id].isSubclipped;
  }
}
