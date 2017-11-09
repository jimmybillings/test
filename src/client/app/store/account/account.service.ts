import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { FutureApiService } from '../api/api.service';
import { Api } from '../../shared/interfaces/api.interface';

@Injectable()
export class AccountService {
  constructor(private apiService: FutureApiService) { }

  public getAccount(accountId: number): Observable<any> {
    return this.apiService.get(Api.Identities, `account/${accountId}`, { loadingIndicator: true });
  }
}
