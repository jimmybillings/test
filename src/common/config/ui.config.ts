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
      get: this._apiConfig.getApiRoot() + 'api/identities/configuration/site?siteName='
    };
  }

  /**
   * Ajax http.get request to return site configuration.
   * @param site  site name to retrieve configuration information for example: 'cnn' or 'core'.
   * @returns     When observable is subscribed to it returns configuration object for the given site name.
   */
  public get(site: string): Observable<any> {
    return this._http.get(this._apiUrls.get + site, {
      headers: this._apiConfig.getApiHeaders()
    }).map((res: Response) => {
      this.set(res.json());
      return this._config;
    });
  }

  /**
   * 
   * @param config   Configuration options to establish a configuration object.
   */
  public set(config: IuiConfig): void {
    this._config = config;
  }

  /**
   * @returns  The currently set configuration object.
   */
  public ui(): IuiConfig {
    return this._config;
  }
}
