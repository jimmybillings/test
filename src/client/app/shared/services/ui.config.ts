import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { ApiService } from './api.service';
import { Api } from '../interfaces/api.interface';

const InitState: any = { components: {} };
export const config: ActionReducer<any> = (state = InitState, action: Action) => {

  switch (action.type) {
    case 'INITIALIZE':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
/**
 * Service that exposes low level api paths for site configuration information. 
 * This information is how will customize different portals.
 */
@Injectable()
export class UiConfig {
  constructor(public store: Store<any>, private api: ApiService) { }

  public initialize(loggedIn: boolean, siteName: string): Observable<any> {
    let localConfig = localStorage.getItem('uiConfig') || JSON.stringify(InitState);
    this.set(JSON.parse(localConfig));

    return this.api.get(
      Api.Identities,
      'configuration/site',
      loggedIn ? { parameters: { siteName: siteName } } : {}
    ).do(response => this.set(response));
  }

  public set(config: any) {
    localStorage.setItem('uiConfig', JSON.stringify(config));
    this.store.dispatch({ type: 'INITIALIZE', payload: config });
  }

  public get(component: string = ''): Observable<any> {
    return this.store.select('config').map((config: any) => {
      config = JSON.parse(JSON.stringify(config));
      return (component === '') ? config : config.components[component] || {};
    });
  }
}
