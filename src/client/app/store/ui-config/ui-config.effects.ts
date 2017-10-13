import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { AppStore } from '../../app.store';
import { UiConfigService } from './ui-config.service';
import * as UiConfigActions from './ui-config.actions';
import * as UiConfigState from './ui-config.state';

@Injectable()
export class UiConfigEffects {
  @Effect()
  public initialize: Observable<Action> = this.actions.ofType(UiConfigActions.Load.Type)
    .map(action => {
      let localConfig = localStorage.getItem('uiConfig') || JSON.stringify(UiConfigState.initialState);
      return this.store.create(factory => factory.uiConfig.initializeSuccess(JSON.parse(localConfig)));
    });

  @Effect()
  public load: Observable<Action> = this.actions.ofType(UiConfigActions.Load.Type)
    .switchMap(() => this.service.load()
      .map(config => {
        localStorage.setItem('uiConfig', JSON.stringify(config));
        return this.store.create(factory => factory.uiConfig.loadSuccess(config));
      }).catch(error => Observable.of(this.store.create(factory => factory.uiConfig.initializeFailure(error))))
    );

  constructor(private actions: Actions, private store: AppStore, private service: UiConfigService) { }
}
