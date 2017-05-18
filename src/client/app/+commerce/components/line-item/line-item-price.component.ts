import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'line-item-price-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      layout="row"
      layout-gt-sm="column"
      class="line-item-price"
      layout-align="end center"
      layout-align-gt-sm="center end">
        <div class="multiplier" *ngIf="shouldShowMultiplier">
          <span>{{ 'QUOTE.MULTIPLIER_INDICATOR' | translate:{multiplier: multiplier} }}</span>
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
