import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { LineItems } from '../../components/line-items';

@Component({
  moduleId: module.id,
  selector: 'quote-line-items-component',
  templateUrl: './quote-line-items.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteLineItemsComponent extends LineItems {
  @Input() quoteType: 'standard' | 'provisionalOrder' | 'offlineAgreement' = 'standard';
  constructor() {
    super();
  }

  public canCalculatePrice(lineItem: any): boolean {
    return lineItem.rightsManaged === 'Rights Managed' && this.quoteType !== 'provisionalOrder';
  }
}
