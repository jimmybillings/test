import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../../app.store';
import { AccountService } from './account.service';
import * as AccountActions from './account.actions';

@Injectable()
export class AccountEffects {

  @Effect()
  public getAccountForQuoteAdmin: Observable<Action> = this.actions
    .ofType(AccountActions.GetAccountForQuoteAdmin.Type)
    .switchMap((action: AccountActions.GetAccountForQuoteAdmin) =>
      this.service.getAccount(action.accountId)
        .map(response =>
          this.store.create(factory => factory.account.getAccountForQuoteAdminSuccess(response))
        )
    );

  constructor(private actions: Actions, private store: AppStore, private service: AccountService) { }
}
