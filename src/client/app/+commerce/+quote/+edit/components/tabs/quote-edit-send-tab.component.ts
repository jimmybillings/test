import { Common } from '../../../../../shared/utilities/common.functions';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { User, Account } from '../../../../../shared/interfaces/user.interface';
import { Tab } from '../../../../components/tabs/tab';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  QuoteOptions,
  SendDetails,
  SendDetailsBillingAccount,
  SendDetailsInvoiceContact,
  SendDetailsUser,
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


  public get user(): Observable<SendDetailsUser> {
    return this.store.select(state => state.quoteEdit)
      .map(quoteEdit => quoteEdit.sendDetails.user);
  }

  public get billingAccount(): Observable<SendDetailsBillingAccount> {
    return this.store.select(state => state.quoteEdit)
      .map(quoteEdit => quoteEdit.sendDetails.billingAccount);
  }

  public get invoiceContact(): Observable<SendDetailsInvoiceContact> {
    return this.store.select(state => state.quoteEdit)
      .map(quoteEdit => quoteEdit.sendDetails.invoiceContact);
  }

  public get salesManager(): Observable<SendDetailsInvoiceContact> {
    return this.store.select(state => state.quoteEdit)
      .map(quoteEdit => quoteEdit.sendDetails.salesManager);
  }

  public userSelect(user: User) {
    this.store.dispatch(factory => factory.quoteEdit.addUserToQuote(user));
  }

  public accountSelect(account: Account) {
    this.store.dispatch(factory => factory.quoteEdit.addBillingAccountToQuote(account));
  }

  public invoiceContactSelect(userId: number) {
    // this.store.dispatch(factory => factory.quoteEdit.addInvoiceContactToQuote(userId))
  }

}
