import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { WzFormComponent } from '../../../../../shared/modules/wz-form/wz.form.component';
import { Common } from '../../../../../shared/utilities/common.functions';
import { User } from '../../../../../shared/interfaces/user.interface';
import { Account } from '../../../../../shared/interfaces/account.interface';
import { Tab } from '../../../../components/tabs/tab';
import { CurrentUserService } from '../../../../../shared/services/current-user.service';
import {
  QuoteOptions,
  SendDetails,
  SendDetailsBillingAccount,
  SendDetailsInvoiceContact,
  SendDetailsUser,
  SendDetailsSalesManager,
} from '../../../../../shared/interfaces/commerce.interface';
import { AppStore } from '../../../../../app.store';
import { Pojo } from '../../../../../shared/interfaces/common.interface';
import { FormFields } from '../../../../../shared/interfaces/forms.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-edit-recipient-tab-component',
  templateUrl: 'quote-edit-recipient-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteEditRecipientTabComponent extends Tab implements OnInit {
  @ViewChild('invoiceContactform') public invoiceContactform: WzFormComponent;
  public config: {
    user: FormFields[];
    billingAccount: FormFields[];
    invoiceContact: Pojo[];
    salesManager: FormFields[];
  };
  private maxTermsDaysSet: boolean = false;

  constructor(private store: AppStore, private currentUserService: CurrentUserService) {
    super();
    this.config = this.sendConfig();
  }

  ngOnInit() {
    this.initializeSalesManagerInState();
    this.listenToStateChanges();
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

  public get salesManager(): Observable<SendDetailsSalesManager> {
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

  public get allBillingSelectionComplete(): Observable<boolean> {
    return this.store.select(state => {
      return this.userAccountMatchesBillingAccount(state.quoteEdit.sendDetails) ||
        this.allBillingFieldsSelected(state.quoteEdit.sendDetails);
    });
  }

  public onEditableFieldChange(change: Pojo): void {
    this.store.dispatch(factory => factory.quoteEdit.updateBillingAccount(change));
  }

  private userAccountMatchesBillingAccount(sendDetails: SendDetails): boolean {
    return (sendDetails.user.hasOwnProperty('accountName') && sendDetails.billingAccount.hasOwnProperty('name'))
      && sendDetails.user.accountName === sendDetails.billingAccount.name
      && (sendDetails.billingAccount.salesOwner !== null && sendDetails.billingAccount.salesOwner !== '')
      && (sendDetails.billingAccount.paymentTermsDays !== null && sendDetails.billingAccount.paymentTermsDays !== '');
  }

  private allBillingFieldsSelected(sendDetails: SendDetails): boolean {
    return sendDetails.user.hasOwnProperty('accountName') &&
      sendDetails.billingAccount.hasOwnProperty('id') &&
      sendDetails.invoiceContact.hasOwnProperty('id') &&
      (sendDetails.billingAccount.salesOwner !== null && sendDetails.billingAccount.salesOwner !== '') &&
      (sendDetails.billingAccount.paymentTermsDays !== null && sendDetails.billingAccount.paymentTermsDays !== '');
  }

  private initializeSalesManagerInState(): void {
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

  private listenToStateChanges(): void {
    this.store.select(state => state.quoteEdit.sendDetails).subscribe(state => {
      this.mergeFormValues(state);
      this.updateFormValidity(state);
    });
  }

  private updateFormValidity(state: SendDetails): void {
    if (!this.invoiceContactform) return;

    if ((state.billingAccount.name === state.user.accountName) && !state.invoiceContact.hasOwnProperty('id')) {
      this.invoiceContactform.resetForm();
    }

    if ((state.billingAccount.name !== state.user.accountName) && !state.invoiceContact.hasOwnProperty('id')) {
      this.invoiceContactform.markFieldsAsTouched();
    }
  }

  private mergeFormValues(state: SendDetails): void {
    if (state.billingAccount.id) {
      this.config.billingAccount = this.config.billingAccount.map(field => {
        field.value = state.billingAccount[field.name];
        if (field.hasOwnProperty('max') && state.billingAccount.hasOwnProperty('paymentTermsDays') && !this.maxTermsDaysSet) {
          field.max = state.billingAccount.paymentTermsDays;
          this.maxTermsDaysSet = true;
        }
        return field;
      });
    }

    if (state.invoiceContact.contacts) {
      const contact = state.invoiceContact.contacts.find(c => {
        return c.id === state.billingAccount.invoiceContactId;
      });
      this.config.invoiceContact[0].value = contact || '';
      this.config.invoiceContact[0].options = state.invoiceContact.contacts;
    }
  }

  private sendConfig(): any {
    return {
      user: [
        {
          endPoint: 'user/searchFields',
          queryParams: 'fields,emailAddress,values',
          service: 'identities',
          suggestionHeading: 'Matching users',
          name: 'emailAddress',
          label: 'QUOTE.EDIT.FORMS.RECIPIENT_EMAIL_LABEL',
          type: 'suggestions',
          value: '',
          validation: 'REQUIRED'
        }
      ],
      billingAccount: [
        {
          endPoint: 'account/searchFields',
          queryParams: 'fields,name,values',
          service: 'identities',
          suggestionHeading: 'Matching accounts',
          name: 'name',
          label: 'QUOTE.EDIT.FORMS.ACCOUNT_NAME_LABEL',
          type: 'suggestions',
          value: '',
          validation: 'REQUIRED'
        }, {
          name: 'salesOwner',
          label: 'QUOTE.EDIT.SALES_OWNER_KEY',
          type: 'text',
          value: '',
          validation: 'REQUIRED'
        }, {
          name: 'paymentTermsDays',
          label: 'QUOTE.EDIT.PAYMENT_TERMS_DAYS_KEY',
          type: 'number',
          value: '',
          validation: 'REQUIRED',
          min: 0,
          max: 0
        }
      ],
      invoiceContact: [
        {
          name: 'invoiceContact',
          options: [],
          label: 'QUOTE.EDIT.FORMS.INVOICE_CONTACT_LABEL',
          type: 'select',
          value: '',
          validation: 'REQUIRED'
        }
      ],
      salesManager: [
        {
          default: 'TODAY+15',
          name: 'expirationDate',
          label: 'QUOTE.EDIT.FORMS.EXPIRATION_DATE_LABEL',
          type: 'wzdate',
          minimum: 'TODAY',
          validation: 'REQUIRED'
        },
        {
          name: 'salesManager',
          label: 'QUOTE.EDIT.FORMS.SALES_MANAGER_LABEL',
          type: 'email',
          value: this.currentUserService.state.emailAddress,
          validation: 'EMAIL'
        }, {
          name: 'offlineAgreementReference',
          label: 'QUOTE.EDIT.FORMS.OFFLINE_AGREEMENT_LABEL',
          type: 'textarea',
          value: '',
          validation: 'OPTIONAL'
        }
      ]
    };
  }
}
