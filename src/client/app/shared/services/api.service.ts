import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, RequestOptions, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Error } from './error.service';
import { ApiConfig } from './api.config';
import { UiState } from './ui.state';
import { CurrentUser } from './current-user.model';

export enum Api {
  Identities,
  Orders
};

export interface ApiParameters {
  [key: string]: string;
}

export interface ApiBody {
  [key: string]: any;
};

export interface ApiOptions {
  parameters?: ApiParameters;
  body?: ApiBody;
  loading?: boolean;
  overridingToken?: string;
}

@Injectable()
export class ApiService {
  constructor(
    private http: Http,
    private error: Error,
    private apiConfig: ApiConfig,
    private uiState: UiState,
    private currentUser: CurrentUser) { }

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

  public get2(api: Api, endpoint: string, options: ApiOptions = {}): Observable<Object> {
    return this.call(RequestMethod.Get, api, endpoint, options);
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

  public post2(api: Api, endpoint: string, options: ApiOptions = {}): Observable<Object> {
    return this.call(RequestMethod.Post, api, endpoint, options);
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

  public put2(api: Api, endpoint: string, options: ApiOptions = {}): Observable<Object> {
    return this.call(RequestMethod.Put, api, endpoint, options);
  }

  public delete(url: string, options: RequestOptionsArgs = {}, loading: boolean = false): Observable<any> {
    if (loading) this.uiState.loading(true);
    return this.http.delete(this.buildUrl(url), this.buildOptions(options)).map((res) => {
      this.uiState.loading(false);
      return res;
    }).catch((error: any) => {
      this.uiState.loading(false);
      this.error.dispatch(error);
      return Observable.throw(error);
    });
  }

  public delete2(api: Api, endpoint: string, options: ApiOptions = {}): Observable<Object> {
    return this.call(RequestMethod.Delete, api, endpoint, options);
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

  private call(method: RequestMethod, api: Api, endpoint: string, options: ApiOptions): Observable<Object> {
    options = this.combineDefaultOptionsWith(options);
    if (options.loading) this.uiState.loading(true);

    const request: Request = new Request(
      new RequestOptions(
        { method: method, url: this.urlFor(api, endpoint), body: this.bodyJsonFrom(options.body) }
      ).merge(this.requestOptionsArgsFrom(options))
    );

    return this.http.request(request)
      .do(response => { return; }, error => { return; }, () => this.uiState.loading(false))
      .map(response => response.json())
      .catch(error => {
        error = error.json();
        this.error.dispatch(error);
        return Observable.throw(error);
      });
  }

  private combineDefaultOptionsWith(options: ApiOptions): ApiOptions {
    return Object.assign(
      {},
      { parameters: {}, body: {}, loading: false, overridingToken: '' },
      options
    );
  }

  private urlFor(api: Api, endpoint: string) {
    return `${this.apiConfig.baseUrl()}api/${this.pathSegmentFor(api)}/${this.versionFor(api)}/${endpoint}`;
  }

  private pathSegmentFor(api: Api): string {
    return Api[api].toLowerCase();
  }

  private versionFor(api: Api): string {
    switch (api) {
      case Api.Identities: return 'v1';
      case Api.Orders: return 'v1';
      default: return '?';
    };
  }

  private bodyJsonFrom(bodyObject: ApiBody): string {
    if (!this.currentUser.loggedIn()) {
      bodyObject = Object.assign({}, bodyObject, { siteName: this.apiConfig.getPortal() });
    }

    return JSON.stringify(bodyObject);
  }

  private requestOptionsArgsFrom(options: ApiOptions): RequestOptionsArgs {
    const requestOptionsArgs: RequestOptionsArgs = {};
    const parameters: ApiParameters = options.parameters;
    let search: URLSearchParams;

    if (parameters !== {}) {
      search = new URLSearchParams();
      for (const parameter in parameters) {
        search.set(parameter, parameters[parameter]);
      }
    }

    if (!this.currentUser.loggedIn()) {
      if (!search) search = new URLSearchParams();
      search.set('siteName', this.apiConfig.getPortal());
    }

    if (search) requestOptionsArgs.search = search;
    requestOptionsArgs.headers = this.apiConfig.userHeaders(options.overridingToken);

    return requestOptionsArgs;
  }

  private buildOptions(options: any) {
    options.headers = this.apiConfig.userHeaders();
    if (!options.search && !this.currentUser.loggedIn()) options.search = new URLSearchParams();
    if (!this.currentUser.loggedIn()) options.search.set('siteName', this.apiConfig.getPortal());
    return options;
  }

  private buildUrl(url: any): string {
    return this.apiConfig.baseUrl() + url;
  }

  private buildBody(body: any): string {
    if (!this.currentUser.loggedIn() && body !== '') {
      body = JSON.parse(body);
      body.siteName = this.apiConfig.getPortal();
      body = JSON.stringify(body);
    }
    return body;
  }
}
