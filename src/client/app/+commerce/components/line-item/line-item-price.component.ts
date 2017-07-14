import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'line-item-price-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      layout="row"
      layout-gt-xs="column"
      class="line-item-price"
      layout-align="end center"
      layout-align-gt-xs="center end">
        <div *ngIf="shouldShowMultiplier" 
          class="multiplier-base"
          layout="row"
          layout-align="end center"
          >
          <div class="label" flex="100">{{ 'QUOTE.MULTIPLIER_BASE_PRICE_LABEL' | translate }}</div>
          <div class="price" flex="no-grow">{{ price/multiplier | currency:'USD':true:'1.2-2' }}</div>
        </div>
        <div *ngIf="shouldShowMultiplier" 
          class="multiplier"
          layout="row"
          layout-align="end center"
          >
          <div class="label" flex="100">{{ 'QUOTE.MULTIPLIER_LABEL' | translate }}</div>
          <div class="multiplier-value" flex="no-grow">{{ 'QUOTE.MULTIPLIER_VALUE' | translate:{multiplier: multiplier} }}</div>
        </div>
        <div class="price" [ngClass]="{'select-usage': needsAttributes }">
          {{ price | currency:'USD':true:'1.2-2' }}
        </div>
    </div>
  `
})
export class LineItemPriceComponent {
  @Input() price: number;
  @Input() multiplier: number;
  @Input() userCanAdministerQuotes: boolean;
  @Input() rightsManaged: string;
  @Input() hasAttributes: boolean;

  public get needsAttributes(): boolean {
    return this.rightsManaged === 'Rights Managed' && !this.hasAttributes;
  }

  public get shouldShowMultiplier(): boolean {
    return this.userCanAdministerQuotes && this.multiplier > 1;
  }
}
