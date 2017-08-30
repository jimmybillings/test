import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FutureApiService } from './api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Cart } from '../../shared/interfaces/commerce.interface';

@Injectable()
export class FutureCartService {
  constructor(private apiService: FutureApiService) { }

  public load(): Observable<Cart> {
    return this.apiService.get(Api.Orders, 'cart', { loadingIndicator: true });
  }
}
