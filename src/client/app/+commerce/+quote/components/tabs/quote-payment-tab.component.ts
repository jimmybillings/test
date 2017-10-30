import { Component, Inject, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CommercePaymentTab } from '../../../components/tabs/commerce-payment-tab';
import { QuoteService } from '../../../../shared/services/quote.service';
import { QuoteState, PaymentOptions } from '../../../../shared/interfaces/commerce.interface';
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

  public get showTrialMessage(): Observable<boolean> {
    return this.quoteService.paymentOptionsEqual(['Trial']);
  }

  public get showOfflineAgreementMessage(): Observable<boolean> {
    return this.quoteService.paymentOptions.map((options: PaymentOptions) => {
      return options && options.paymentOptions.every(o => o.includes('Offline'));
    });
  }

  public selectInvoiceLater() {
    this.quoteService.updateSelectedPaymentType(this.quoteService.state.data.purchaseType);
    this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
  }
}
