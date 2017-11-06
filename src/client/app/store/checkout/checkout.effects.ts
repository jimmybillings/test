import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../../app.store';
import * as CheckoutActions from './checkout.actions';

@Injectable()
export class CheckoutEffects {
  constructor(private actions: Actions, private store: AppStore) { }
}
