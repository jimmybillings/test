import { User } from '../../shared/interfaces/user.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../../app.store';
import { FutureUserService } from './user.service';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {

  @Effect()
  public addBillingAccountToQuote: Observable<Action> = this.actions
    .ofType(UserActions.GetAllUsersByAccountId.Type)
    .switchMap((action: UserActions.GetAllUsersByAccountId) =>
      this.service.getUsersByAccountId(action.accountId)
        .map((response: User[]) =>
          this.store.create(factory => factory.user.getAllUsersByAccountIdSuccess(response))
        )
    );

  constructor(private actions: Actions, private store: AppStore, private service: FutureUserService) { }
}
