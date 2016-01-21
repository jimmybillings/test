import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import { Router } from 'angular2/router';
import { User } from './user.data.service';

@Injectable()
export class Authentication {

  public http: Http;
  private apiConfig: ApiConfig;
  private router: Router;
  private _user: User;
  private _sessionUrls: {
    create: string,
    destroy: string
  };

  constructor(http: Http, apiConfig: ApiConfig, router: Router, _user: User) {
    this.http = http;
    this.apiConfig = apiConfig;
    this.router = router;
    this._user = _user;
    this._sessionUrls = {
      create: this.apiConfig.getApiRoot()+ 'users-api/login',
      destroy: this.apiConfig.getApiRoot()+ 'users-api/invalidate'
    };
  }

  public create(user:Object) {
    this.http.post(this._sessionUrls.create,
      JSON.stringify(user), {
        headers: this.apiConfig.getApiHeaders()
      }).subscribe((res:Response) => {
       localStorage.setItem('token', res.json().token);
       this._user.get();
       this.router.navigate(['/Home']);
      });
  }

  public destory() {
    this.http.post(this._sessionUrls.destroy, null, {
        headers: this.apiConfig.getAuthHeader()
      }).subscribe((res:Response) => {
       localStorage.clear();
      });
  }
}



