import { Injectable } from 'angular2/core';
import {Http, Response} from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import {CurrentUser} from '../models/current-user.model';

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
      create: this.apiConfig.getApiRoot()+ 'users-api/user/register',
      get: this.apiConfig.getApiRoot()+ 'users-api/user/currentUser'
    };
  }

  create(user: Object) {
    return this.http.post(this._apiUrls.create,
      JSON.stringify(user), {
        headers: this.apiConfig.getApiHeaders()
      });
  }

  get() {
    this.http.get(this._apiUrls.get, {
      headers: this.apiConfig.getAuthHeader()
    }).subscribe((res: Response) => {
      this._currentUser.set(res.json().user);
    });
  }
}
