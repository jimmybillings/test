import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import { CurrentUser } from '../models/current-user.model';

@Injectable()
export class UserRole {

  public http: Http;
  private apiConfig: ApiConfig;
  private _currentUser: CurrentUser;
  private _apiUrls: {
    create: string,
    show: string,
    search: string,
    update: string,
    destroy: string
  };

  constructor(http: Http, apiConfig: ApiConfig, _currentUser: CurrentUser) {
    this.http = http;
    this.apiConfig = apiConfig;
    this._currentUser = _currentUser;
    this._apiUrls = {
      create: this.apiConfig.getApiRoot()+ 'users-api/user/userRole',
      show: this.apiConfig.getApiRoot()+ 'users-api/user/userRole/',
      search: this.apiConfig.getApiRoot()+ 'users-api/user/userRole/search?text=',
      update: this.apiConfig.getApiRoot()+ 'users-api/user/userRole/',
      destroy: this.apiConfig.getApiRoot()+ 'users-api/user/userRole/'
    };
  }

  create(userRole: Object) {
    return this.http.post(this._apiUrls.create,
      JSON.stringify(userRole), {
        headers: this.apiConfig.getApiHeaders()
      });
  }

  show(id: number) {
    return this.http.get(this._apiUrls.show+id, {
        headers: this.apiConfig.getApiHeaders()
      });
  }
  
  search(criteria: string) {
    return this.http.get(this._apiUrls.search+criteria, {
      headers: this.apiConfig.getAuthHeader()
    }); 
  }
  
  update(userRole: any) {
    return this.http.put(this._apiUrls.update+userRole.id, 
      JSON.stringify(userRole), {
        headers: this.apiConfig.getApiHeaders()
      });
  }
  
  destroy(id: number) {
    return this.http.delete(this._apiUrls.show+id, {
        headers: this.apiConfig.getApiHeaders()
      });
  }
}
