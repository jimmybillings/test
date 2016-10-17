import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, RequestOptions, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Error } from './error.service';
import { ApiConfig } from './api.config';
import { Api, ApiOptions, ApiParameters, ApiBody, ApiResponse } from '../interfaces/api.interface';
import { UiState } from './ui.state';
import { CurrentUser } from './current-user.model';

@Injectable()
export class ApiService {
  constructor(
    private http: Http,
    private error: Error,
    private apiConfig: ApiConfig,
    private uiState: UiState,
    private currentUser: CurrentUser
  ) { }

  public get(api: Api, endpoint: string, options: ApiOptions = {}): Observable<ApiResponse> {
    return this.call(RequestMethod.Get, api, endpoint, options);
  }

  public post(api: Api, endpoint: string, options: ApiOptions = {}): Observable<ApiResponse> {
    return this.call(RequestMethod.Post, api, endpoint, options);
  }

  public put(api: Api, endpoint: string, options: ApiOptions = {}): Observable<ApiResponse> {
    return this.call(RequestMethod.Put, api, endpoint, options);
  }

  public delete(api: Api, endpoint: string, options: ApiOptions = {}): Observable<ApiResponse> {
    return this.call(RequestMethod.Delete, api, endpoint, options);
  }

  // //// END OF PUBLIC INTERFACE

  private call(method: RequestMethod, api: Api, endpoint: string, options: ApiOptions): Observable<ApiResponse> {
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
      case Api.Assets: return 'v1';
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
    requestOptionsArgs.headers = this.apiConfig.headers(options.overridingToken);

    return requestOptionsArgs;
  }
}
