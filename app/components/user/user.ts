import { Injectable } from 'angular2/core';
import {HTTP_PROVIDERS, Http, Response, Headers} from 'angular2/http';

@Injectable()
export class User {
  
  public http: Http;
  private token: string
  private _apiUrls: {
    create: string,
    login: string,
    get: string
  };
  
  constructor(http: Http) {
    this.http = http;
    this._apiUrls = {
      create: 'http://poc1.crux.t3sandbox.xyz./users-api/user/register',
      login: 'http://poc1.crux.t3sandbox.xyz./users-api/login',
      get: 'http://ec2-54-201-187-186.us-west-2.compute.amazonaws.com/users-api/user/currentUser'
    }
  }
        
  create(user: Object) {
    return this.http.post(this._apiUrls.create, 
      JSON.stringify(user), {
        headers: new Headers({'Content-Type': 'application/json'})
      })
  }
        
  login(user:Object) {
    this.http.post(this._apiUrls.login, 
      JSON.stringify(user), {
        headers: new Headers({'Content-Type': 'application/json'})
      }).subscribe((res:Response) => {
       console.log(res.json())
       this.token = res.json().token
       this.get()
      });
  }
        
  get() {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+this.token})
    var some = this.http.get(this._apiUrls.get, {
      headers: headers
    }).map(response => response.json());
  }            
}

