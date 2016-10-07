import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
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

  constructor(public api: ApiService) {
    this._apiUrls = {
      create: 'api/identities/v1/login',
      destroy: 'api/identities/v1/invalidate'
    };
  }

  public create(user: Object): Observable<any> {
    return this.api.post(this._apiUrls.create, JSON.stringify(user))
      .map((res: Response) => res.json());
  }

  public destroy(): Observable<any> {
    return this.api.post(this._apiUrls.destroy);
  }
}



