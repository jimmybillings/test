import { Component, Inject, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommercePaymentTab } from '../../../components/tabs/commerce-payment-tab';
import { QuoteService } from '../../../../shared/services/quote.service';
import { UiConfig } from '../../../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'quote-payment-tab',
  templateUrl: 'quote-payment-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuotePaymentTabComponent extends CommercePaymentTab {
  constructor(
    _zone: NgZone,
    quoteService: QuoteService,
    uiConfig: UiConfig,
    ref: ChangeDetectorRef
  ) {
    super(_zone, quoteService, uiConfig, ref);
  }

  public selectInvoiceLater(event: any) {
    if (event.checked) {
      this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
    } else {
      this.disableTab(3);
    }
  }
}
