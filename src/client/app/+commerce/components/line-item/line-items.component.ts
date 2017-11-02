import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Project, AssetLineItem, OrderableType } from '../../../shared/interfaces/commerce.interface';
import { Capabilities } from '../../../shared/services/capabilities.service';
import { EnhancedAsset } from '../../../shared/interfaces/enhanced-asset';

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
    if (items) this.items = items;
  };
  @Input() quoteType: OrderableType;
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

  public shouldDisplayRights(lineItem: AssetLineItem): boolean {
    return lineItem.rightsManaged === 'Rights Managed' && this.quoteType !== 'Trial';
  }

  public shouldShowTargets(lineItem: AssetLineItem): boolean {
    return lineItem.transcodeTargets && lineItem.transcodeTargets.length > 0;
  }

  public get shouldDisplayPricing(): boolean {
    return this.quoteType !== 'Trial';
  }

  public onOpenCostMultiplierForm(lineItem: AssetLineItem): void {
    this.lineItemsNotify.emit({ type: 'SHOW_COST_MULTIPLIER_DIALOG', payload: lineItem });
  }

  public onRemoveCostMultiplier(lineItem: AssetLineItem): void {
    this.lineItemsNotify.emit({ type: 'REMOVE_COST_MULTIPLIER', payload: lineItem });
  }

  public isSubclipped(asset: EnhancedAsset): boolean {
    return asset.isSubclipped;
  }

  public onAddCustomPrice(lineItem: AssetLineItem): void {
    this.lineItemsNotify.emit({ type: 'ADD_CUSTOM_PRICE', payload: lineItem });
  }
}
