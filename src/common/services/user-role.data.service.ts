import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import {Observable} from 'rxjs/Observable';

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
      create: this.apiConfig.getApiRoot() + 'api/identities/userRole',
      show: this.apiConfig.getApiRoot() + 'api/identities/userRole/',
      search: this.apiConfig.getApiRoot() + 'api/identities/userRole/search?text=',
      update: this.apiConfig.getApiRoot() + 'api/identities/userRole/',
      destroy: this.apiConfig.getApiRoot() + 'api/identities/userRole/'
    };
  }

  create(userRole: Object): Observable<any> {
    return this.http.post(this._apiUrls.create,
      JSON.stringify(userRole), {
        headers: this.apiConfig.getAuthHeader()
      });
  }

  show(id: number): Observable<any> {
    return this.http.get(this._apiUrls.show + id, {
      headers: this.apiConfig.getAuthHeader()
    });
  }

  search(criteria: string): Observable<any> {
    return this.http.get(this._apiUrls.search + criteria, {
      headers: this.apiConfig.getAuthHeader()
    });
  }

  update(userRole: any): Observable<any> {
    return this.http.put(this._apiUrls.update + userRole.id,
      JSON.stringify(userRole), {
        headers: this.apiConfig.getAuthHeader()
      });
  }

  destroy(id: number): Observable<any> {
    return this.http.delete(this._apiUrls.show + id, {
      headers: this.apiConfig.getAuthHeader()
    });
  }
}
