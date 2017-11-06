import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FutureApiService } from '../api/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Invoice } from '../../shared/interfaces/commerce.interface';

@Injectable()
export class InvoiceService {
  constructor(private apiService: FutureApiService) { }

  public load(orderId: number): Observable<Invoice> {
    return this.apiService.get(Api.Orders, `order/invoiceData/${orderId}`, { loadingIndicator: true });
  }
}
