import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';

/**
 * Service that provides access to the api for logging user in and out.
 */
@Injectable()
export class Authentication {
  constructor(private api: ApiService) { }

  public create(user: Object): Observable<any> {
    return this.api.post(Api.Identities, 'login', { body: user, loading: true });
  }

  public destroy(): Observable<any> {
    return this.api.post(Api.Identities, 'invalidate');
  }
}
