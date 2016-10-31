import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';


/**
 * Service that provides api access registering new users.  
 */
@Injectable()
export class User {
  constructor(private api: ApiService) { }

  public create(user: Object): Observable<any> {
    return this.api.post(Api.Identities, 'user/register', { body: user, loading: true });
  }

  public get(): Observable<any> {
    return this.api.get(Api.Identities, 'user/currentUser');
  }

  public forgotPassword(user: any): Observable<any> {
    return this.api.post(Api.Identities, 'user/requestPasswordReset', { parameters: user, loading: true });
  }

  public resetPassword(user: any, overridingToken:string): Observable<any> {
    return this.api.post(Api.Identities, 'user/passwordReset', { body: user, overridingToken: overridingToken, loading: true});
  }
}
