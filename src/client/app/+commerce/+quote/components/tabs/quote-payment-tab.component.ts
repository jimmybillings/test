import { Component, Inject, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CommercePaymentTab } from '../../../components/tabs/commerce-payment-tab';
import { QuoteService } from '../../../../shared/services/quote.service';
import { QuoteState, QuoteType } from '../../../../shared/interfaces/commerce.interface';
import { AppStore } from '../../../../app.store';

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
    store: AppStore,
    ref: ChangeDetectorRef
  ) {
    super(_zone, quoteService, store, ref);
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
