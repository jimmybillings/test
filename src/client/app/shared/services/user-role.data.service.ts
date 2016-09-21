import { Injectable } from '@angular/core';
import { ApiConfig } from '../services/api.config';
import { Observable } from 'rxjs/Rx';
import { ApiService } from './api.service';

@Injectable()
export class UserRole {

  public _apiUrls: {
    create: string,
    show: string,
    search: string,
    update: string,
    destroy: string
  };

  constructor(public api: ApiService, public apiConfig: ApiConfig) {
    this._apiUrls = {
      create: this.apiConfig.baseUrl() + 'api/identities/v1/userRole',
      show: this.apiConfig.baseUrl() + 'api/identities/v1/userRole/',
      search: this.apiConfig.baseUrl() + 'api/identities/v1/userRole/search?text=',
      update: this.apiConfig.baseUrl() + 'api/identities/v1/userRole/',
      destroy: this.apiConfig.baseUrl() + 'api/identities/v1/userRole/'
    };
  }

  create(userRole: Object): Observable<any> {
    return this.api.post(this._apiUrls.create, JSON.stringify(userRole));
  }

  show(id: number): Observable<any> {
    return this.api.get(this._apiUrls.show + id);
  }

  search(criteria: string): Observable<any> {
    return this.api.get(this._apiUrls.search + criteria);
  }

  update(userRole: any): Observable<any> {
    return this.api.put(this._apiUrls.update + userRole.id, JSON.stringify(userRole));
  }

  destroy(id: number): Observable<any> {
    return this.api.delete(this._apiUrls.show + id);
  }
}
