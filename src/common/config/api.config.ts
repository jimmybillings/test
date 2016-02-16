import { Injectable } from 'angular2/core';
import { Headers } from 'angular2/http';

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
    return this._portal;
  }

}
