import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'line-item-price-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div flex="100" layout="row" layout-xs="column" class="divider"></div>
    <div class="price" [ngClass]="{'select-usage': needsAttributes }">
      {{ price | currency:'USD':true:'1.2-2' }}
    </div>
    <div class="multiplier" *ngIf="shouldShowMultiplier">
      <span>{{ 'QUOTE.MULTIPLIER_INDICATOR' | translate:{multiplier: multiplier} }}</span>
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
