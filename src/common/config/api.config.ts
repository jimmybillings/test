import { Injectable } from 'angular2/core';
import { Headers } from 'angular2/http';
  
/**
 * Service that exposes low level api paths, api request header information 
 * for authorization, and some getter and setters for portal names.
 */  

@Injectable()
export class ApiConfig {
  private _portal: string;
  
  /**
   * Initializes private var 'portal' to null
   */  
  constructor() {
    this._portal = null;
  }
  /**
   * @returns   Api root path. Example: 'https://crxextapi.dev.wzplatform.com/'.
   */
  public baseUrl(): string {
    return window['baseUrl'];
  }
  /**
   * @returns   Request Headers include Content-Type: application/json, 
   *            and Authorization: Bearer with token value from localStorage
   */
  public authHeaders(): Headers {
    return new Headers({ 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
      'Authorization': 'Bearer ' + localStorage.getItem('token') 
    });
  }

  /**
   * @returns   Request Header information 'Content-Type': 'application/json'
   */
  public headers(): Headers {
    return new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  }

  /**
   * set the private var 'portal' to the name passed in.
   * @param portal    Sets value passed as the name of the portal. Examples: 'cnn', 'core'  
   */
  public setPortal(portal: string): void {
    this._portal = portal;
  }

  /**
   * @returns  Portal name. If no value is set, return value defaults to 'core'
   */
  public getPortal(): string {
    return this._portal || 'core';
  }

}
