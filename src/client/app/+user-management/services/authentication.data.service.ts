import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import {Observable} from 'rxjs/Rx';

/**
 * Service that provides access to the api for logging user in and out.  
 */
@Injectable()
export class Authentication {

  public http: Http;
  public apiConfig: ApiConfig;
  public _apiUrls: {
    create: string,
    destroy: string
  };

  constructor(http: Http, apiConfig: ApiConfig) {
    this.http = http;
    this.apiConfig = apiConfig;
    this._apiUrls = {
      create: this.apiConfig.baseUrl() + 'api/identities/v1/login',
      destroy: this.apiConfig.baseUrl() + 'api/identities/v1/invalidate'
    };
  }

  public create(user: Object): Observable<any> {
    return this.http.post(this._apiUrls.create,
      JSON.stringify(user), {
        headers: this.apiConfig.headers()
      }).map((res: Response) => res.json());
  }

  public destroy(): Observable<any> {
    return this.http.post(this._apiUrls.destroy, null, {
      headers: this.apiConfig.authHeaders()
    });
  }
}



