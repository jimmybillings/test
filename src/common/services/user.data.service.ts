import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import { CurrentUser } from '../models/current-user.model';
import {Observable} from 'rxjs/Observable';

/**
 * Service that provides api access registering new users.  
 */  
@Injectable()
export class User {

  public http: Http;
  private apiConfig: ApiConfig;
  private _currentUser: CurrentUser;
  private _apiUrls: {
    create: string,
    get: string
  };

  constructor(http: Http, apiConfig: ApiConfig, _currentUser: CurrentUser) {
    this.http = http;
    this.apiConfig = apiConfig;
    this._currentUser = _currentUser;
    this._apiUrls = {
      create: this.apiConfig.baseUrl() + 'api/identities/v1/user/register',
      get: this.apiConfig.baseUrl() + 'api/identities/v1/user/currentUser'
    };
  }
  
  /**
   * Creates a new user by registration form.
   * @param user  Registration form fields.
   * @returns     Prepared request to register a new user.
  */
  create(user: Object): Observable<any> {
    return this.http.post(this._apiUrls.create,
      JSON.stringify(user), {
        headers: this.apiConfig.headers()
      }).map((res:Response) => res.json());
  }

  get(): Observable<any> {
    return this.http.get(this._apiUrls.get, {
      headers: this.apiConfig.authHeaders()
    });
  }
}
