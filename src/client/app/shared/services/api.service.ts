import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, RequestOptions, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ApiConfig } from './api.config';
import { Api, ApiOptions, ApiParameters, ApiBody, ApiErrorResponse } from '../interfaces/api.interface';
import { AppStore } from '../../app.store';

@Injectable()
export class ApiService {
  // NOTE that all "private" properties and methods are temporarily "protected" to allow FutureApiService to
  // override/access them as needed.

  constructor(
    protected http: Http,
    protected apiConfig: ApiConfig,
    protected store: AppStore
  ) {
  }

  public get(api: Api, endpoint: string, options: ApiOptions = {}): Observable<any> {
    return this.call(RequestMethod.Get, api, endpoint, options);
  }

  public post(api: Api, endpoint: string, options: ApiOptions = {}): Observable<any> {
    return this.call(RequestMethod.Post, api, endpoint, options);
  }

  public put(api: Api, endpoint: string, options: ApiOptions = {}): Observable<any> {
    return this.call(RequestMethod.Put, api, endpoint, options);
  }

  public delete(api: Api, endpoint: string, options: ApiOptions = {}): Observable<any> {
    return this.call(RequestMethod.Delete, api, endpoint, options);
  }

  // //// END OF PUBLIC INTERFACE
  // NOTE that all "private" methods are temporarily "protected" to allow FutureApiService to override/access as necessary.
  protected call(method: RequestMethod, api: Api, endpoint: string, options: ApiOptions): Observable<any> {
    options = this.combineDefaultOptionsWith(options);

    this.showLoadingIf(options.loadingIndicator === 'onBeforeRequest' || options.loadingIndicator === true);

    const request: Request = new Request(
      new RequestOptions(
        { method: method, url: this.urlFor(api, endpoint), body: this.bodyJsonFrom(options.body) }
      ).merge(this.requestOptionsArgsFrom(options))
    );

    return this.http.request(request)
      .map(response => { try { return response.json(); } catch (exception) { return response; } })
      .do(() => {
        this.hideLoadingIf(options.loadingIndicator === 'offAfterResponse' || options.loadingIndicator === true);
      }, (error: ApiErrorResponse) => {
        this.hideLoadingIf(options.loadingIndicator === 'offAfterResponse' || options.loadingIndicator === true);
        try { return error.json(); } catch (exception) { this.store.dispatch(factory => factory.error.handle(error)); }
        return error;
      });
  }

  protected combineDefaultOptionsWith(options: ApiOptions): ApiOptions {
    return Object.assign(
      {},
      { parameters: {}, body: {}, loadingIndicator: false, overridingToken: '' },
      options
    );
  }

  protected showLoadingIf(loadingOption: boolean) {
    if (loadingOption) this.store.dispatch(factory => factory.loadingIndicator.show());
  }

  protected hideLoadingIf(loadingOption: boolean) {
    if (loadingOption) this.store.dispatch(factory => factory.loadingIndicator.hide());
  }

  protected urlFor(api: Api, endpoint: string) {
    return `${this.apiConfig.baseUrl}${this.pathSegmentFor(api)}-api/${this.versionFor(api)}/${endpoint}`;
  }

  protected pathSegmentFor(api: Api): string {
    return (Api[api] || '?').toLowerCase();
  }

  protected versionFor(api: Api): string {
    switch (api) {
      case Api.Identities: return 'v1';
      case Api.Assets: return 'v1';
      case Api.Orders: return 'v1';
      default: return 'v?';
    };
  }

  protected bodyJsonFrom(bodyObject: ApiBody): string {
    bodyObject = Object.assign({}, bodyObject, { siteName: this.apiConfig.portal });

    return JSON.stringify(bodyObject);
  }

  protected requestOptionsArgsFrom(options: ApiOptions): RequestOptionsArgs {
    let [search, searchWasSet] = this.searchParametersFrom(options.parameters);
    const requestOptionsArgs: RequestOptionsArgs = {};

    requestOptionsArgs.headers = this.apiConfig.headers(options.overridingToken, options.headerType);
    if (searchWasSet) requestOptionsArgs.search = search;

    return requestOptionsArgs;
  }

  protected searchParametersFrom(parameters: ApiParameters): Array<any> {
    const search: URLSearchParams = new URLSearchParams();

    if (parameters['siteName']) console.error('Cannot set siteName externally.');

    Object.keys(parameters)
      .filter(parameter => (parameter !== 'siteName'))
      .forEach(parameter => search.set(parameter, parameters[parameter]));

    search.set('siteName', this.apiConfig.portal);

    return [search, search.toString().length > 0];
  }
}
