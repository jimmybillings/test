import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
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
    public api: ApiService) {
    this._apiUrls = {
      create: 'api/identities/v1/user/register',
      get: 'api/identities/v1/user/currentUser'
    };
  }

  create(user: Object): Observable<any> {
    return this.api.post(this._apiUrls.create, JSON.stringify(user), {}, true)
      .map((res: Response) => res.json());
  }

  get(): Observable<any> {
    return this.api.get(this._apiUrls.get);
  }
}
