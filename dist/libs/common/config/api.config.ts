import { Injectable } from 'angular2/core';
import { Headers } from 'angular2/http';

@Injectable()
export class ApiConfig {
  private _portal: string;
  constructor() {
    this._portal = null;
  }
  public getApiRoot() {
    return 'http://dev.crux.t3sandbox.xyz.:8080/';
  }

  public getAuthHeader() {
    return new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem('token')});
  }

  public getApiHeaders() {
    return new Headers({'Content-Type': 'application/json'});
  }
  
  public setPortal(portal: string) {
    this._portal = portal;
  }
  
  public getPortal() {
    return this._portal;
  }

}
