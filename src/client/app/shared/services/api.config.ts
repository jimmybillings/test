import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { CurrentUser } from './current-user.model';
declare var baseUrl: string;

const cmsApi: any = {
  root: 'https://cms.dev.wzplatform.com/',
  path: '/wp-json/wp/v2/pages',
  query: '?filter[name]='
};

@Injectable()
export class ApiConfig {

  private _portal: string;

  constructor(private currentUser: CurrentUser) {
    this._portal = null;
  }

  public baseUrl(): string {
    return baseUrl;
  }

  public headers(overridingToken: string = '', download: boolean = false): Headers {
    const headers: { [name: string]: any } = {
      'Content-Type': 'application/json',
    };

    let token: string = '';

    if (overridingToken !== '') {
      token = overridingToken;
    } else if (this.currentUser.loggedIn()) {
      token = localStorage.getItem('token');
    }

    if (token !== '') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (download) {
      headers['Accept'] = 'application/octet-stream';
    } else {
      headers['Accept'] = 'application/json';
    }

    return new Headers(headers);
  }

  public setPortal(portal: string): void {
    this._portal = portal;
  }

  public getPortal(): string {
    return this._portal || 'core';
  }

  public cms(piece: string): string {
    return cmsApi[piece];
  }

}
