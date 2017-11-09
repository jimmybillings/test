import { Common } from '../../../../../shared/utilities/common.functions';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { User, Account } from '../../../../../shared/interfaces/user.interface';
import { Tab } from '../../../../components/tabs/tab';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  QuoteOptions,
  QuoteRecipient,
  QuoteRecipientBillingAccount,
  QuoteRecipientInvoiceContact,
  QuoteRecipientUser,
} from '../../../../../shared/interfaces/commerce.interface';
import { AppStore } from '../../../../../app.store';
import { Pojo } from '../../../../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-edit-send-tab-component',
  templateUrl: 'quote-edit-send-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteEditSendTabComponent extends Tab {

  constructor(private store: AppStore) {
    super();
    this.store.select(state => state.quoteEdit).subscribe(c => console.log(c));
  }

  public onSubmitSendQuote(options: QuoteOptions): void {
    this.store.dispatch(factory => factory.quoteEdit.saveRecipientInformationOnQuote({
      ownerEmail: options.ownerEmail,
      expirationDate: new Date(options.expirationDate).toISOString(),
      purchaseType: options.purchaseType.split(' ').join(''),
      offlineAgreementId: options.offlineAgreementId
    }));
    this.goToNextTab();
  }

  public get user(): Observable<QuoteRecipientUser> {
    return this.store.select(state => state.quoteEdit)
      .map(quoteEdit => quoteEdit.recipient.user);
  }

  public get billingAccount(): Observable<QuoteRecipientBillingAccount> {
    return this.store.select(state => state.quoteEdit)
      .map(quoteEdit => quoteEdit.recipient.billingAccount);
  }

  public get invoiceContact(): Observable<QuoteRecipientInvoiceContact> {
    return this.store.select(state => state.quoteEdit)
      .map(quoteEdit => quoteEdit.recipient.invoiceContact);
  }

  public userSelect(user: User) {
    this.store.dispatch(factory => factory.quoteEdit.addUserToQuote(user));
  }

  public accountSelect(account: Account) {
    this.store.dispatch(factory => factory.quoteEdit.addBillingAccountToQuote(account));
  }

  public invoiceContactSelect(info: any) {
    console.log(info);
  }

}
