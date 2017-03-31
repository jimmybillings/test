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
  `
})
export class LineItemPriceComponent {
  @Input() price: number;
  @Input() rightsManaged: string;
  @Input() hasAttributes: boolean;

  public get needsAttributes(): boolean {
    return this.rightsManaged === 'Rights Managed' && !this.hasAttributes;
  }
}
