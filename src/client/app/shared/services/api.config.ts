import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { CurrentUserService } from './current-user.service';
declare var baseUrl: string;

const cmsApi: any = {
  root: 'https://cms.dev.wzplatform.com/',
  path: '/wp-json/wp/v2/pages',
  query: '?filter[name]='
};

@Injectable()
export class ApiConfig {

  private _portal: string;

  constructor(private currentUser: CurrentUserService) {
    this._portal = null;
  }

  public baseUrl(): string {
    return baseUrl;
  }

  public headers(overridingToken: string = '', headerType: string = 'json'): Headers {
    let token: string = '';

    if (overridingToken !== '') {
      token = overridingToken;
    } else if (this.currentUser.loggedIn()) {
      token = localStorage.getItem('token');
    }

    const headers: { [name: string]: any } = {
      'Content-Type': 'application/json',
    };

    if (token !== '') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    switch (headerType) {
      case 'json':
        headers['Accept'] = 'application/json';
        break;
      case 'download':
        headers['Accept'] = 'application/octet-stream';
        break;
      case 'form-urlencoded':
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        break;
      default:
        headers['Accept'] = 'application/json';
        break;
    }

    return new Headers(headers);
  }

  public setPortal(portal: string): void {
    this._portal = portal;
  }

  public getPortal(): string {
    return this._portal;
  }

  public cms(piece: string): string {
    return cmsApi[piece];
  }

}
