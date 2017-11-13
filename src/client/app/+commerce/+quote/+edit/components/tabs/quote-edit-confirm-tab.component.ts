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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .recipient {
      background-color: rgba(255,255,255,0.65);
      color: rgba(0,0,0,0.7);
      max-width: calc(33.333% - 12px);
      min-width: calc(33.333% - 12px);
      padding: 15px;
      margin-bottom: 15px;
    }
    .recipient span {
      display: inline-block;
      font-weight:bold;
    }
    .recipient ul {
      list-style-type: none;
      padding-left: 0;
    }
  `]

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
