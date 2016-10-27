import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';
import { Api, ApiOptions } from '../../shared/interfaces/api.interface';


/**
 * Service that provides api access registering new users.  
 */
@Injectable()
export class User {
  constructor(private api: ApiService) { }

  public create(user: Object): Observable<any> {
    return this.api.post(Api.Identities, 'user/register', { body: user, loading: true });
  }

  // TODO: This appears not to be used anywhere... remove it?
  // If it is used somewhere -- is the caller doing an unecessary json() call on the result?
  public get(): Observable<any> {
    return this.api.get(Api.Identities, 'user/currentUser');
  }

  public forgotPassword(user: any): Observable<any> {
    user.email = user.emailAddress;
    delete user.emailAddress;
    return this.api.post(Api.Identities, 'user/requestPasswordReset', { parameters: user, loading: true });
  }

  public resetPassword(user: any, overridingToken?:string): Observable<any> {
    let options: ApiOptions = { loading: true };
    options.body = user;
    if (overridingToken) options.overridingToken = overridingToken;
    return this.api.post(Api.Identities, 'user/passwordReset', options);
  }
}
