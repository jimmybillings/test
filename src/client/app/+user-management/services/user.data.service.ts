import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable} from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';


/**
 * Service that provides api access registering new users.  
 */
@Injectable()
export class User {

  public _apiUrls: {
    create: string,
    get: string
  };

  constructor(
    public api: ApiService,
    public apiConfig: ApiConfig) {
    this._apiUrls = {
      create: this.apiConfig.baseUrl() + 'api/identities/v1/user/register',
      get: this.apiConfig.baseUrl() + 'api/identities/v1/user/currentUser'
    };
  }

  create(user: Object): Observable<any> {
    return this.api.post(this._apiUrls.create, JSON.stringify(user))
      .map((res: Response) => res.json());
  }

  get(): Observable<any> {
    return this.api.get(this._apiUrls.get);
  }
}
