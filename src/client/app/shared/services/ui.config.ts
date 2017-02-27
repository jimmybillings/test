import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { ApiService } from './api.service';
import { Api } from '../interfaces/api.interface';

const InitState: any = { loaded: false, components: {} };
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

  public initialize(siteName: string): Observable<any> {
    let localConfig = localStorage.getItem('uiConfig') || JSON.stringify(InitState);
    this.set(JSON.parse(localConfig));
    if (!this.hasLoaded()) {
      return this.load(siteName);
    } else {
      return Observable.of({});
    }
  }

  public load(siteName: string): Observable<any> {
    return this.api.get(
      Api.Identities,
      'configuration/site',
      { parameters: { siteName: siteName } }
    ).do(response => this.set(Object.assign(response, { loaded: true })));
  }

  public set(config: any) {
    localStorage.setItem('uiConfig', JSON.stringify(config));
    this.store.dispatch({ type: 'INITIALIZE', payload: config });
  }

  public get(component: string = ''): Observable<any> {
    return this.store.select('config').map((config: any) => {
      return (component === '') ? config : config.components[component] || {};
    });
  }

  public hasLoaded() {
    let hasLoaded: boolean = false;
    this.store.select('config')
      .take(1)
      .subscribe((config: any) => hasLoaded = config.loaded);
    return hasLoaded;
  }
}
