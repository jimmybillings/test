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

  public authHeaders(): Headers {
    return new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
  }

  public get userHeaders(): Headers {
    return (this.currentUser.loggedIn()) ? this.authHeaders() : this.headers();
  }

  public headers(): Headers {
    return new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
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
