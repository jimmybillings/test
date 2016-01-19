import { Injectable, Inject } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../config/api.config'
import { Router } from 'angular2/router'

@Injectable()
export class Authentication {
  
  public http: Http;
  private token: string;
  private apiConfig: ApiConfig;
  private router: Router;
  private _sessionUrls: {
    create: string,
    destroy: string
  };
  
  constructor(http: Http, apiConfig: ApiConfig, router: Router) {
    this.http = http;
    this.apiConfig = apiConfig;
    this.router = router
    this._sessionUrls = {
      create: this.apiConfig.getApiRoot()+ 'users-api/login',
      destroy: this.apiConfig.getApiRoot()+ 'users-api/invalidate'
    }
  }
        
  public create(user:Object) {
    this.http.post(this._sessionUrls.create, 
      JSON.stringify(user), {
        headers: this.apiConfig.getApiHeaders()
      }).subscribe((res:Response) => {
       localStorage.setItem('token', res.json().token);
       this.router.navigate(['/Home'])
      })
  } 
  
  public destory() {
    this.http.post(this._sessionUrls.destroy, null, {
        headers: this.apiConfig.getAuthHeader()
      }).subscribe((res:Response) => {
       localStorage.clear();
      });
  }        
}

