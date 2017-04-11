import { Component, Inject, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommercePaymentTab } from '../../../components/tabs/commerce-payment-tab';
import { QuoteEditService } from '../../../../shared/services/quote-edit.service';
import { UiConfig } from '../../../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'quote-payment-tab',
  templateUrl: '../../../components/tabs/commerce-payment-tab.html'
})

export class QuotePaymentTabComponent extends CommercePaymentTab {
  constructor(
    _zone: NgZone,
    quoteEditService: QuoteEditService,
    uiConfig: UiConfig,
    ref: ChangeDetectorRef
  ) {
    super(_zone, quoteEditService, uiConfig, ref);
  }
}
