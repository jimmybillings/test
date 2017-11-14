import { Observable } from 'rxjs/Observable';
import {
  PurchaseType,
  Project,
  QuoteOptions,
  SendDetails,
  quotesWithoutPricing
} from '../../../../../shared/interfaces/commerce.interface';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Capabilities } from '../../../../../shared/services/capabilities.service';

import { AppStore } from '../../../../../app.store';

@Component({
  moduleId: module.id,
  selector: 'quote-edit-confirm-tab-component',
  templateUrl: 'quote-edit-confirm-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteEditConfirmTabComponent {
  @Input() projects: Project[];

  constructor(public userCan: Capabilities, private store: AppStore) { }

  public get recipientInformation(): Observable<SendDetails> {
    return this.store.select(state => state.quoteEdit.sendDetails);
  }

  public sendQuote() {
    this.store.dispatch(factory =>
      factory.quoteEdit.sendQuote(this.store.snapshot(state => state.quoteEdit.sendDetails))
    );
  }

  public get showTotal(): Observable<boolean> {
    return this.store.select(state => !quotesWithoutPricing.includes(state.quoteEdit.data.purchaseType));
  }

  public get quoteType(): Observable<PurchaseType> {
    return this.store.select(state => state.quoteEdit.data.purchaseType);
  }

  public get total(): Observable<number> {
    return this.store.select(state => state.quoteEdit.data.total);
  }
}
