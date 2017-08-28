import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as SnackbarActions from '../actions/snackbar.actions';
import { AppStore } from '../../app.store';
import { SnackbarService } from '../services/snackbar.service';

@Injectable()
export class SnackbarEffects {
  @Effect()
  public display: Observable<Action> = this.actions.ofType(SnackbarActions.Display.Type)
    .switchMap((action: SnackbarActions.Display) =>
      this.service.display(action.messageKey, action.messageParameters)
        .map((translatedString: string) => this.store.create(factory => factory.snackbar.displaySuccess(translatedString)))
    );

  constructor(private actions: Actions, private store: AppStore, private service: SnackbarService) { }
}
