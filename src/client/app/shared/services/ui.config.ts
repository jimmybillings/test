import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiConfig } from '../services/api.config';
import {Observable} from 'rxjs/Rx';
import { Store, Reducer, Action} from '@ngrx/store';

const InitState: any = { components: {} };
export const config: Reducer<any> = (state = InitState, action: Action) => {

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
    public _apiConfig: ApiConfig,
    public store: Store<any>,
    private _http: Http) {

    this._apiUrls = {
      get: this._apiConfig.baseUrl() + 'api/identities/v1/configuration/site?siteName='
    };
  }

  public initialize(site: string): Observable<any> {
    let localConfig = localStorage.getItem('uiConfig') || JSON.stringify(InitState);
    this.set(JSON.parse(localConfig));
    return this._http.get(this._apiUrls.get + site, {
      headers: this._apiConfig.headers()
    }).map((res: Response) => {
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
