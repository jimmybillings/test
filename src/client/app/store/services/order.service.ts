import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FutureApiService } from './api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Order } from '../../shared/interfaces/commerce.interface';

@Injectable()
export class OrderService {
  constructor(private apiService: FutureApiService) { }

  public load(orderId: number): Observable<Order> {
    return this.apiService.get(Api.Orders, `order/${orderId}`, { loadingIndicator: true });
  }
}
