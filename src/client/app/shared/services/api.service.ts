import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, RequestOptions, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ErrorStore } from '../stores/error.store';
import { ApiConfig } from './api.config';
import { Api, ApiOptions, ApiParameters, ApiBody, ApiResponse } from '../interfaces/api.interface';
import { UiState } from './ui.state';

@Injectable()
export class ApiService {
  constructor(
    private http: Http,
    private error: ErrorStore,
    private apiConfig: ApiConfig,
    private uiState: UiState
  ) {
  }

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

    this.showLoadingIf(options.loading);

    const request: Request = new Request(
      new RequestOptions(
        { method: method, url: this.urlFor(api, endpoint), body: this.bodyJsonFrom(options.body) }
      ).merge(this.requestOptionsArgsFrom(options))
    );

    return this.http.request(request)
      .map(response => { try { return response.json(); } catch (exception) { return response; } })
      .do(() => this.hideLoadingIf(options.loading), error => {
        this.hideLoadingIf(options.loading);
        try { return error.json(); } catch (exception) { this.error.dispatch(error); }
        return error;
      });
  }

  private combineDefaultOptionsWith(options: ApiOptions): ApiOptions {
    return Object.assign(
      {},
      { parameters: {}, body: {}, loading: false, overridingToken: '' },
      options
    );
  }

  private showLoadingIf(loadingOption: boolean) {
    if (loadingOption) this.uiState.loading(true);
  }

  private hideLoadingIf(loadingOption: boolean) {
    if (loadingOption) this.uiState.loading(false);
  }

  private urlFor(api: Api, endpoint: string) {
    return `${this.apiConfig.baseUrl()}${this.pathSegmentFor(api)}-api/${this.versionFor(api)}/${endpoint}`;
  }

  private pathSegmentFor(api: Api): string {
    return (Api[api] || '?').toLowerCase();
  }

  private versionFor(api: Api): string {
    switch (api) {
      case Api.Identities: return 'v1';
      case Api.Assets: return 'v1';
      case Api.Orders: return 'v1';
      default: return 'v?';
    };
  }

  private bodyJsonFrom(bodyObject: ApiBody): string {
    bodyObject = Object.assign({}, bodyObject, { siteName: this.apiConfig.getPortal() });

    return JSON.stringify(bodyObject);
  }

  private requestOptionsArgsFrom(options: ApiOptions): RequestOptionsArgs {
    let [search, searchWasSet] = this.searchParametersFrom(options.parameters);
    const requestOptionsArgs: RequestOptionsArgs = {};

    requestOptionsArgs.headers = this.apiConfig.headers(options.overridingToken, options.headerType);
    if (searchWasSet) requestOptionsArgs.search = search;

    return requestOptionsArgs;
  }

  private searchParametersFrom(parameters: ApiParameters): Array<any> {
    const search: URLSearchParams = new URLSearchParams();

    for (const parameter in parameters) {
      search.set(parameter, parameters[parameter]);
    }

    search.set('siteName', this.apiConfig.getPortal());

    return [search, search.toString().length > 0];
  }
}
