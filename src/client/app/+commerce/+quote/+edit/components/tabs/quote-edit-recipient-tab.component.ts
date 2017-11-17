import { WzFormComponent } from '../../../../../shared/modules/wz-form/wz.form.component';
import { Common } from '../../../../../shared/utilities/common.functions';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../../../shared/interfaces/user.interface';
import { Account } from '../../../../../shared/interfaces/account.interface';

import { Tab } from '../../../../components/tabs/tab';
import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { CurrentUserService } from '../../../../../shared/services/current-user.service';
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
  selector: 'quote-edit-recipient-tab-component',
  templateUrl: 'quote-edit-recipient-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteEditRecipientTabComponent extends Tab implements OnInit {
  @ViewChild('invoiceContactform') public invoiceContactform: WzFormComponent;

  constructor(private store: AppStore, private currentUserService: CurrentUserService) { super(); }

  ngOnInit() {
    this.initializeSalesManagerForm();
    this.monitorAndUpdateFormValidity();
  }

  public get user(): Observable<SendDetailsUser> {
    return this.store.select(state => state.quoteEdit.sendDetails.user);
  }

  public get billingAccount(): Observable<SendDetailsBillingAccount> {
    return this.store.select(state => state.quoteEdit.sendDetails.billingAccount);
  }

  public get invoiceContact(): Observable<SendDetailsInvoiceContact> {
    return this.store.select(state => state.quoteEdit.sendDetails.invoiceContact);
  }

  public get salesManager(): Observable<SendDetailsInvoiceContact> {
    return this.store.select(state => state.quoteEdit.sendDetails.salesManager);
  }

  public userSelect(user: User): void {
    this.store.dispatch(factory => factory.quoteEdit.addUserToQuote(user));
  }

  public accountSelect(account: Account): void {
    this.store.dispatch(factory => factory.quoteEdit.addBillingAccountToQuote(account));
  }

  public invoiceContactSelect(event: Pojo): void {
    this.store.dispatch(factory => factory.quoteEdit.addInvoiceContactToQuote(event.value));
  }

  public onBlur(form: Pojo): void {
    this.store.dispatch(factory => factory.quoteEdit.updateSalesManagerFormOnQuote(form));
  }

  public get allBillingSelectionComplete(): Observable<Boolean> {
    return this.store.select(state => state.quoteEdit)
      .filter(quoteEdit => (
        this.userAccountMatchesBillingAccount(quoteEdit.sendDetails) ||
        this.allBillingFieldsSelected(quoteEdit.sendDetails)
      )).map(() => true);
  }

  private userAccountMatchesBillingAccount(sendDetails: SendDetails): boolean {
    return (sendDetails.user.hasOwnProperty('accountName') && sendDetails.billingAccount.hasOwnProperty('name'))
      && (sendDetails.user.accountName === sendDetails.billingAccount.name);
  }

  private allBillingFieldsSelected(sendDetails: SendDetails): boolean {
    return sendDetails.user.hasOwnProperty('accountName') &&
      sendDetails.billingAccount.hasOwnProperty('id') &&
      sendDetails.invoiceContact.hasOwnProperty('id');
  }

  private initializeSalesManagerForm(): void {
    this.store.dispatch(factory =>
      factory.quoteEdit.initializeSalesManagerFormOnQuote(
        this.currentUserService.state.emailAddress,
        this.defaultDate(15)
      )
    );
  }

  private defaultDate(days: number): string {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10).replace(/-/g, '/');
  }

  private monitorAndUpdateFormValidity(): void {
    this.store.select(state => state.quoteEdit.sendDetails).subscribe(c => {
      if (!this.invoiceContactform) return;
      if ((c.billingAccount.name === c.user.accountName) && !c.invoiceContact.hasOwnProperty('id')) {
        this.invoiceContactform.resetForm();
      }
      if ((c.billingAccount.name !== c.user.accountName) && !c.invoiceContact.hasOwnProperty('id')) {
        this.invoiceContactform.markFieldsAsTouched();
      }
    });
  }

}
