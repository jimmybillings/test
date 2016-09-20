import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable} from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';

/**
 * Service that provides access to the api for logging user in and out.  
 */
@Injectable()
export class Authentication {

  public _apiUrls: {
    create: string,
    destroy: string
  };

  constructor(public api: ApiService, public apiConfig: ApiConfig) {
    this._apiUrls = {
      create: this.apiConfig.baseUrl() + 'api/identities/v1/login',
      destroy: this.apiConfig.baseUrl() + 'api/identities/v1/invalidate'
    };
  }

  public create(user: Object): Observable<any> {
    return this.api.post(this._apiUrls.create, JSON.stringify(user))
      .map((res: Response) => res.json());
  }

  public destroy(): Observable<any> {
    return this.api.post(this._apiUrls.destroy, null)
      .do(() => localStorage.removeItem('token'));
  }
}



