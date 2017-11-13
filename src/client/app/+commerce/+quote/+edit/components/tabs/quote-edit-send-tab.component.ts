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
    this.store.dispatch(factory =>
      factory.quoteEdit.addSalesManagerToQuote(
        JSON.parse(localStorage.getItem('currentUser')).emailAddress
      )
    );
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

  public invoiceContactSelect(event: Pojo) {
    this.store.dispatch(factory => factory.quoteEdit.addInvoiceContactToQuote(event.value));
  }

  public get allBillingSelectionComplete(): Observable<Boolean> {
    return this.store.select(state => state.quoteEdit)
      .filter(quoteEdit => (
        this.userAccountMatchesBillingAccount(quoteEdit.sendDetails) ||
        this.allBillingFieldsSelected(quoteEdit.sendDetails)
      )
      ).map(() => true);
  }

  public onBlur(form: Pojo) {
    this.store.dispatch(factory => factory.quoteEdit.updateSalesManagerFormOnQuote(form));
  }

  private userAccountMatchesBillingAccount(sendDetails: SendDetails) {
    console.log(sendDetails);
    return (sendDetails.user.hasOwnProperty('accountName') && sendDetails.billingAccount.hasOwnProperty('name'))
      && (sendDetails.user.accountName === sendDetails.billingAccount.name);
  }

  private allBillingFieldsSelected(sendDetails: SendDetails) {
    return sendDetails.user.hasOwnProperty('accountName') &&
      sendDetails.billingAccount.hasOwnProperty('id') &&
      sendDetails.invoiceContact.hasOwnProperty('id');
  }

}
