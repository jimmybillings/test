import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import {Observable} from 'rxjs/Observable';

/**
 * Service that provides access to the api for logging user in and out.  
 */  
@Injectable()
export class Authentication {

  public http: Http;
  private apiConfig: ApiConfig;
  private _apiUrls: {
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
  
  /**
   * Ajax post request to login a user.
   * @param user   Typically from the login form. Example:{"userId": "admin@wazeedigital.com","password": "admin","siteName": "core"}
   * @returns      Response from login api which is a user object with a token, permissions, and accountIds.
   */
  public create(user: Object): Observable<any> {
    return this.http.post(this._apiUrls.create,
      JSON.stringify(user), {
        headers: this.apiConfig.headers()
      }).map((res:Response) => res.json());
  }
  
  /**
   * Ajax post request to invalidate user token (log out). 
   * @returns      Response from api Token invalidated if successful
   */
  public destroy(): Observable<any> {
    return this.http.post(this._apiUrls.destroy, null, {
      headers: this.apiConfig.authHeaders()
    });
  }
}



