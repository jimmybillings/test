import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { ApiService } from './api.service';

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
  public _apiUrls: {
    get: string
  };

  constructor(
    public store: Store<any>,
    private api: ApiService) {

    this._apiUrls = {
      get: 'api/identities/v1/configuration/site'
    };
  }

  public initialize(loggedIn: boolean, siteName: string): Observable<any> {
    let localConfig = localStorage.getItem('uiConfig') || JSON.stringify(InitState);
    this.set(JSON.parse(localConfig));
    if (loggedIn) this._apiUrls.get = this._apiUrls.get + '?siteName=' + siteName;
    return this.api.get(this._apiUrls.get)
      .do((res: Response) => {
        this.set(res.json());
      });
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
}
