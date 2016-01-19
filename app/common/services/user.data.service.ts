import { Injectable } from 'angular2/core';
import {HTTP_PROVIDERS, Http, Response, Headers} from 'angular2/http';
import { ApiConfig } from '../config/api.config'

@Injectable()
export class User {
  
  public http: Http;
  private token: string;
  private apiConfig: ApiConfig
  private _apiUrls: {
    create: string,
    get: string
  };
  
  constructor(http: Http, apiConfig: ApiConfig) {
    this.http = http;
    this.apiConfig = apiConfig;
    this._apiUrls = {
      create: this.apiConfig.getApiRoot()+ 'users-api/user/register',
      get: this.apiConfig.getApiRoot()+ 'users-api/user/currentUser'
    }
  }
        
  create(user: Object) {
    return this.http.post(this._apiUrls.create, 
      JSON.stringify(user), {
        headers: this.apiConfig.getApiHeaders()
      })
  }
        
  get() {
    this.http.get(this._apiUrls.get, {
      headers: this.apiConfig.getAuthHeader()
    }).subscribe((res: Response) => {
      localStorage.setItem('user', JSON.stringify(res.json().user))
    });
  }            
}

