import { Injectable } from 'angular2/core';
import { Headers, RequestOptions, URLSearchParams } from 'angular2/http';
  
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
    return 'http://dev.crux.t3sandbox.xyz.:8080/';
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

  /**
   * The search api requires a different URL depending if you are a logged in user or not.
   * @param isUserLoggedIn  True if current user is logged in and has localStorage information
   * @returns               appropriate api search path based on whether or not user is logged in
   */
  public getAssetSearchPath(isUserLoggedIn : boolean): string {
    return (isUserLoggedIn) ? 'assets-api/clip/user/search' : 'assets-api/clip/anonymous/search';
  }

  /**
   * @param isUserLoggedIn  True if current user is logged in and has localStorage information, and is
   *                        used to set api header information. 
   * @param params          These are the url params when accessing search like q=goats (query string in search), n=25 (assets per page)
   * @returns               If user is not logged you get Query String Parameters that look like
   *                        (q:derby n:25 siteName: core) if the user is logged in additional info is 
   *                        passed into the Request Header like (Authorization:Bearer 48a0ecaa46e2770a7a82810daed4272 
   *                        Content-Type:application/json) and Query String Parameters would be like (q:derby n:25)
   *                        
   */
  public getAssetSearchOptions(params: {[key: string]: string}, isUserLoggedIn : boolean): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for(var param in params) search.set(param, params[param]);
    
    if (!isUserLoggedIn) search.set('siteName', this.getPortal());  
    
    let headers = (isUserLoggedIn) ? this.authHeaders() : void null;
    let options = (isUserLoggedIn) ? {headers: headers, search: search} : {search: search};
    return new RequestOptions(options);
  }
}
