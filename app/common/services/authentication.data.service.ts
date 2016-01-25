import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import { User } from './user.data.service';

@Injectable()
export class Authentication {

  public http: Http;
  private apiConfig: ApiConfig;
  private _user: User;
  private _sessionUrls: {
    create: string,
    destroy: string
  };

  constructor(http: Http, apiConfig: ApiConfig, _user: User) {
    this.http = http;
    this.apiConfig = apiConfig;
    this._user = _user;
    this._sessionUrls = {
      create: this.apiConfig.getApiRoot()+ 'users-api/login',
      destroy: this.apiConfig.getApiRoot()+ 'users-api/invalidate'
    };
  }

  public create(user:Object) {
    return this.http.post(this._sessionUrls.create,
      JSON.stringify(user), {
        headers: this.apiConfig.getApiHeaders()
      });
  }

  public destroy() {
    return this.http.post(this._sessionUrls.destroy, null, {
        headers: this.apiConfig.getAuthHeader()
      });
  }
}



