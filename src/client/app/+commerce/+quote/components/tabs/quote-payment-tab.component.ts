import { Component, Inject, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommercePaymentTab } from '../../../components/tabs/commerce-payment-tab';
import { QuoteService } from '../../../../shared/services/quote.service';
import { UiConfig } from '../../../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'quote-payment-tab',
  templateUrl: '../../../components/tabs/commerce-payment-tab.html',
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
}
