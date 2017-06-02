import { Component, Inject, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommercePaymentTab } from '../../../components/tabs/commerce-payment-tab';
import { QuoteService } from '../../../../shared/services/quote.service';
import { QuoteState, QuoteType } from '../../../../shared/interfaces/commerce.interface';
import { UiConfig } from '../../../../shared/services/ui.config';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'quote-payment-tab',
  templateUrl: 'quote-payment-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuotePaymentTabComponent extends CommercePaymentTab {
  constructor(
    _zone: NgZone,
    protected quoteService: QuoteService,
    uiConfig: UiConfig,
    ref: ChangeDetectorRef
  ) {
    super(_zone, quoteService, uiConfig, ref);
  }

  public get showProvisionalOrderMessage(): Observable<boolean> {
    return this.quoteService.paymentOptionsEqual(['ProvisionalOrder']);
  }

  public get showOfflineAgreementMessage(): Observable<boolean> {
    return this.quoteService.paymentOptionsEqual(['OfflineAgreement']);
  }

  public selectInvoiceLater() {
    this.quoteService.updateOrderInProgress('selectedPaymentType', 'OfflineAgreement');
    this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
  }
}
