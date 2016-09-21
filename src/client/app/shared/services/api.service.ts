import { Injectable } from '@angular/core';
import { Http, Request, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Error } from './error.service';
import { ApiConfig } from './api.config';

@Injectable()
export class ApiService {
  constructor(private http: Http, private error: Error, private apiConfig: ApiConfig) {
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<any> {
    return this.http.request(url, options).catch((error: any) => {
      this.error.dispatch(error);
      return error;
    });
  }

  public get(url: string, options: RequestOptionsArgs={}): Observable<any> {
    options.headers = this.apiConfig.userHeaders;
    return this.http.get(url, options).catch((error: any) => {
      this.error.dispatch(error);
      return error;
    });
  }

  public post(url: string, body: string='', options: RequestOptionsArgs={}): Observable<any> {
    options.headers = this.apiConfig.userHeaders;
    return this.http.post(url, body, options).catch((error: any) => {
      this.error.dispatch(error);
      return error;
    });
  }

  public put(url: string, body: string='', options: RequestOptionsArgs={}): Observable<any> {
    options.headers = this.apiConfig.userHeaders;
    return this.http.put(url, body, options).catch((error: any) => {
      this.error.dispatch(error);
      return error;
    });
  }

  public delete(url: string, options: RequestOptionsArgs={}): Observable<any> {
    options.headers = this.apiConfig.userHeaders;
    return this.http.delete(url, options).catch((error: any) => {
      this.error.dispatch(error);
      return error;
    });
  }

  public patch(url: string, body: string='', options: RequestOptionsArgs={}): Observable<any> {
    options.headers = this.apiConfig.userHeaders;
    return this.http.patch(url, body, options).catch((error: any) => {
      this.error.dispatch(error);
      return error;
    });
  }

  public head(url: string, options: RequestOptionsArgs={}): Observable<any> {
    options.headers = this.apiConfig.userHeaders;
    return this.http.head(url, options).catch((error: any) => {
      this.error.dispatch(error);
      return error;
    });
  }
}