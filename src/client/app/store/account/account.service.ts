import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { FutureApiService } from '../api/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { SendDetailsBillingAccount } from '../../shared/interfaces/commerce.interface';

@Injectable()
export class AccountService {
  constructor(private apiService: FutureApiService) { }

  public getAccount(accountId: number): Observable<any> {
    return this.apiService.get(Api.Identities, `account/${accountId}`, { loadingIndicator: true })
      .map((account: SendDetailsBillingAccount) => {
        return {
          id: account.id,
          name: account.name,
          creditExemption: account.creditExemption,
          licensingVertical: account.licensingVertical,
          paymentTermsDays: account.paymentTermsDays,
          purchaseOnCredit: account.purchaseOnCredit,
          invoiceContactId: account.invoiceContactId,
          salesOwner: account.salesOwner
        }
      });
  }
}
