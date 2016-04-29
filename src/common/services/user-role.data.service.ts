import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class UserRole {

  public http: Http;
  private apiConfig: ApiConfig;
  private _apiUrls: {
    create: string,
    show: string,
    search: string,
    update: string,
    destroy: string
  };

  constructor(http: Http, apiConfig: ApiConfig) {
    this.http = http;
    this.apiConfig = apiConfig;
    this._apiUrls = {
      create: this.apiConfig.baseUrl() + 'api/identities/v1/userRole',
      show: this.apiConfig.baseUrl() + 'api/identities/v1/userRole/',
      search: this.apiConfig.baseUrl() + 'api/identities/v1/userRole/search?text=',
      update: this.apiConfig.baseUrl() + 'api/identities/v1/userRole/',
      destroy: this.apiConfig.baseUrl() + 'api/identities/v1/userRole/'
    };
  }

  create(userRole: Object): Observable<any> {
    return this.http.post(this._apiUrls.create,
      JSON.stringify(userRole), {
        headers: this.apiConfig.authHeaders()
      });
  }

  show(id: number): Observable<any> {
    return this.http.get(this._apiUrls.show + id, {
      headers: this.apiConfig.authHeaders()
    });
  }

  search(criteria: string): Observable<any> {
    return this.http.get(this._apiUrls.search + criteria, {
      headers: this.apiConfig.authHeaders()
    });
  }

  update(userRole: any): Observable<any> {
    return this.http.put(this._apiUrls.update + userRole.id,
      JSON.stringify(userRole), {
        headers: this.apiConfig.authHeaders()
      });
  }

  destroy(id: number): Observable<any> {
    return this.http.delete(this._apiUrls.show + id, {
      headers: this.apiConfig.authHeaders()
    });
  }
}
