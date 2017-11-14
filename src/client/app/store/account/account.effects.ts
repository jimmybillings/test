import { SendDetailsBillingAccount } from '../../shared/interfaces/commerce.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Account } from '../../shared/interfaces/user.interface';
import { AppStore } from '../../app.store';
import { AccountService } from './account.service';
import * as AccountActions from './account.actions';

@Injectable()
export class AccountEffects {

  @Effect()
  public getAccountForQuoteAdmin: Observable<Action> = this.actions
    .ofType(AccountActions.GetAccountForQuoteAdmin.Type, AccountActions.GetAccountForQuoteAdminOnUserAdd.Type)
    .switchMap((action: AccountActions.GetAccountForQuoteAdmin | AccountActions.GetAccountForQuoteAdminOnUserAdd) =>
      this.service.getAccount(action.accountId, 'onBeforeRequest')
        .map((account: Account) => (
          {
            id: account.id,
            name: account.name,
            salesOwner: account.salesOwner || null,
            paymentTermsDays: account.paymentTermsDays || null,
            purchaseOnCredit: account.purchaseOnCredit || null,
            creditExemption: account.creditExemption || null,
            licensingVertical: account.licensingVertical || null,
            invoiceContactId: account.invoiceContactId
          }
        ))
        .map((billingAccount: SendDetailsBillingAccount) => {
          return (action.onUserAdd) ?
            this.store.create(factory => factory.account.getAccountForQuoteAdminOnUserAddSuccess(billingAccount)) :
            this.store.create(factory => factory.account.getAccountForQuoteAdminSuccess(billingAccount));
        })
    );

  @Effect()
  public getAccountForQuoteAdminSuccess: Observable<Action> = this.actions
    .ofType(AccountActions.GetAccountForQuoteAdminSuccess.Type, AccountActions.GetAccountForQuoteAdminOnUserAddSuccess.Type)
    .map((action: AccountActions.GetAccountForQuoteAdminSuccess | AccountActions.GetAccountForQuoteAdminOnUserAddSuccess) =>
      this.store.create(factory => factory.user.getAllUsersByAccountId(action.account.id))
    );

  constructor(private actions: Actions, private store: AppStore, private service: AccountService) { }
}
