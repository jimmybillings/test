import { Injectable } from 'angular2/core';
import { Headers, RequestOptions, URLSearchParams } from 'angular2/http';

@Injectable()
export class ApiConfig {
  private _portal: string;
  constructor() {
    this._portal = null;
  }
  public getApiRoot(): string {
    return 'http://dev.crux.t3sandbox.xyz.:8080/';
  }

  public getAuthHeader(): Headers {
    return new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') });
  }

  public getApiHeaders(): Headers {
    return new Headers({ 'Content-Type': 'application/json' });
  }

  public setPortal(portal: string): void {
    this._portal = portal;
  }

  public getPortal(): string {
    return this._portal || 'core';
  }
  
  public getAssetSearchPath(isUserLoggedIn : boolean): string {
    return (isUserLoggedIn) ? 'assets-api/clip/user/search' : 'assets-api/clip/anonymous/search';
  }
  
  public getAssetSearchOptions(params: Object, isUserLoggedIn : boolean): Object {
    const search: URLSearchParams = new URLSearchParams();
    for(var param in params) search.set(param, params[param]);
    
    if (!isUserLoggedIn) search.set('siteName', this.getPortal());  
    
    let headers = (isUserLoggedIn) ? this.getAuthHeader() : null;
    let options = (isUserLoggedIn) ? 
      new RequestOptions({ headers: headers, search: search }) : 
      new RequestOptions({search: search });
    return options;
    
  }
}
