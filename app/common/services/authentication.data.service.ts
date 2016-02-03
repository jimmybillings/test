import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
import { ApiConfig } from '../config/api.config';

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
      create: this.apiConfig.getApiRoot()+ 'api/identities/login',
      destroy: this.apiConfig.getApiRoot()+ 'api/identities/invalidate'
    };
  }

  public create(user:Object) {
    return this.http.post(this._apiUrls.create,
      JSON.stringify(user), {
        headers: this.apiConfig.getApiHeaders()
      });
  }

  public destroy() {
    return this.http.post(this._apiUrls.destroy, null, {
        headers: this.apiConfig.getAuthHeader()
      });
  }
}



