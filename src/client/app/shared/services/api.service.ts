import { Injectable } from '@angular/core';
import { Http, Request, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Error } from './error.service';
import { ApiConfig } from './api.config';
import { UiState } from './ui.state';
import { CurrentUser } from './current-user.model';

@Injectable()
export class ApiService {
  constructor(
    private http: Http,
    private error: Error,
    private apiConfig: ApiConfig,
    private uiState: UiState,
    private currentUser: CurrentUser) {

  }

  public request(url: string | Request, options: RequestOptionsArgs = {}): Observable<any> {
    return this.http.request(this.buildUrl(url), this.buildOptions(options)).catch((error: any) => {
      this.error.dispatch(error);
      return Observable.throw(error);
    });
  }

  public get(url: string, options: RequestOptionsArgs = {}, loading: boolean = false): Observable<any> {
    if (loading) this.uiState.loading(true);
    return this.http.get(this.buildUrl(url), this.buildOptions(options)).map((res) => {
      this.uiState.loading(false);
      return res;
    }).catch((error: any) => {
      this.uiState.loading(false);
      this.error.dispatch(error);
      return Observable.throw(error);
    });
  }

  public post(url: string, body: string = '', options: RequestOptionsArgs = {}, loading: boolean = false): Observable<any> {
    if (loading) this.uiState.loading(true);
    return this.http.post(this.buildUrl(url), this.buildBody(body), this.buildOptions(options)).map((res) => {
      this.uiState.loading(false);
      return res;
    }).catch((error: any) => {
      this.uiState.loading(false);
      this.error.dispatch(error);
      return Observable.throw(error);
    });
  }

  public put(url: string, body: string = '', options: RequestOptionsArgs = {}, loading: boolean = false): Observable<any> {
    if (loading) this.uiState.loading(true);
    return this.http.put(this.buildUrl(url), this.buildBody(body), this.buildOptions(options)).map((res) => {
      this.uiState.loading(false);
      return res;
    }).catch((error: any) => {
      this.uiState.loading(false);
      this.error.dispatch(error);
      return Observable.throw(error);
    });
  }

  public delete(url: string, options: RequestOptionsArgs = {}): Observable<any> {
    return this.http.delete(this.buildUrl(url), this.buildOptions(options)).catch((error: any) => {
      this.error.dispatch(error);
      return Observable.throw(error);
    });
  }

  public patch(url: string, body: string = '', options: RequestOptionsArgs = {}): Observable<any> {
    return this.http.patch(this.buildUrl(url), this.buildBody(body), this.buildOptions(options)).catch((error: any) => {
      this.error.dispatch(error);
      return Observable.throw(error);
    });
  }

  public head(url: string, options: RequestOptionsArgs = {}): Observable<any> {
    return this.http.head(this.buildUrl(url), this.buildOptions(options)).catch((error: any) => {
      this.error.dispatch(error);
      return Observable.throw(error);
    });
  }

  private buildOptions(options: any) {
    options.headers = this.apiConfig.userHeaders();
    if (!options.search && !this.currentUser.loggedIn()) options.search = new URLSearchParams();
    if (!this.currentUser.loggedIn()) options.search.set('siteName', this.apiConfig.getPortal());
    return options;
  }

  private buildUrl(url:any): string {
    return this.apiConfig.baseUrl() + url;
  }

  private buildBody(body:any): string {
    if (!this.currentUser.loggedIn() && body !== '') {
      body = JSON.parse(body);
      body.siteName = this.apiConfig.getPortal();
      body = JSON.stringify(body);
    }
    return body;
  }
}