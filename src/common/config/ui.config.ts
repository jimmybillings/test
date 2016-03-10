import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import {IuiConfig} from '../../common/interfaces/config.interface';
import {Observable} from 'rxjs/Observable';
  
/**
 * Service that exposes low level api paths for site configuration information. 
 * This information is how will customize different portals.
 */
@Injectable()
export class UiConfig {
  private _config: IuiConfig;
  private _apiUrls: {
    get: string
  };

  constructor(
    private _http: Http,
    private _apiConfig: ApiConfig) {
    
    this._apiUrls = {
      get: this._apiConfig.baseUrl() + 'identities-api/v1/configuration/site?siteName='
    };
  }

  /**
   * Ajax http.get request to return site configuration state.
   * @param site  configuration for a portal by site name: 'cnn' or 'core'.
   * @returns     Observable that sets the new configuration state from the server.
   */
  public initialize(site: string): Observable<any> {
    return this._http.get(this._apiUrls.get + site, {
      headers: this._apiConfig.headers()
    }).map((res: Response) => {
      this._config = res.json();
      return this._config;
    });
  }

  /**
   * @returns  The current configuration state.
   */
  public get(component): IuiConfig {
    return this._config.components[component];
  }
}
