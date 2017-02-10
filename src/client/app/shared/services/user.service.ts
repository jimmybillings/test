import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';
import { Api, ApiResponse } from '../../shared/interfaces/api.interface';
import { Response } from '@angular/http';

/**
 * Service that provides api access registering new users.  
 */
@Injectable()
export class UserService {
  public activeVersionId: string;
  constructor(private api: ApiService) { }

  public get(): Observable<any> {
    return this.api.get(Api.Identities, 'user/currentUser');
  }

  public create(user: Object): Observable<any> {
    return this.api.post(Api.Identities, 'user/register',
      { body: user, loading: true }
    );
  }

  public forgotPassword(user: any): Observable<any> {
    return this.api.post(Api.Identities, 'user/requestPasswordReset',
      { body: user, loading: true }
    );
  }

  public resetPassword(user: any, overridingToken: string): Observable<any> {
    return this.api.post(Api.Identities, 'user/passwordReset',
      { body: user, overridingToken: overridingToken, loading: true }
    );
  }

  public downloadActiveTosDocument(): Observable<any> {
    return this.api.get(Api.Identities, 'document/public/name/TOS').flatMap((response: ApiResponse) => {
      this.activeVersionId = response[0].activeVersionId;
      return this.api.get(Api.Identities, `document/public/downloadFile/${response[0].activeVersionId}`, { download: true });
    }).map((response: Response) => {
      return response.text();
    });
  }

  public agreeUserToTerms(): void {
    this.api.post(Api.Identities, `document/version/${this.activeVersionId}/agree`).take(1).subscribe();
  }
}
