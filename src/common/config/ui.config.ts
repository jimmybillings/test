import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class UiConfig {

  private _config: Object;
  private _apiUrls: {
    get: string
  };

  constructor(private _http: Http, private _apiConfig: ApiConfig) {
    this._config = {};
    this._apiUrls = {
      get: this._apiConfig.getApiRoot() + 'api/identities/configuration/site?siteName='
    };
  }

  public get(site: string): Observable<any> {
    return this._http.get(this._apiUrls.get + site, {
      headers: this._apiConfig.getApiHeaders()
    });
  }

  public set(config: Object): void {
    this._config = config;
  }

  public ui(): Object {
    return this._config;
  }
}
