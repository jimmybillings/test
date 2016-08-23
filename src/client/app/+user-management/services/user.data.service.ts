import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Observable} from 'rxjs/Rx';

/**
 * Service that provides api access registering new users.  
 */
@Injectable()
export class User {

  public http: Http;
  public apiConfig: ApiConfig;
  public _currentUser: CurrentUser;
  public _apiUrls: {
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

  create(user: Object): Observable<any> {
    return this.http.post(this._apiUrls.create,
      JSON.stringify(user), {
        headers: this.apiConfig.headers()
      }).map((res: Response) => res.json());
  }

  get(): Observable<any> {
    return this.http.get(this._apiUrls.get, {
      headers: this.apiConfig.authHeaders(), body: ''
    });
  }
}
