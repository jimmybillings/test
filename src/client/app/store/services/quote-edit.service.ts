import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Quote } from '../../shared/interfaces/commerce.interface';
import { FutureApiService } from '../services/api.service';
import { Api, ApiResponse } from '../../shared/interfaces/api.interface';

@Injectable()
export class FutureQuoteEditService {
  constructor(private apiService: FutureApiService) { }

  public load(): Observable<Quote> {
    return this.apiService.get(Api.Orders, 'quote/focused', { loadingIndicator: true });
  }

  public delete(quoteId: number): Observable<Quote> {
    return this.apiService.delete(Api.Orders, `quote/${quoteId}`, { loadingIndicator: 'onBeforeRequest' })
      .switchMap(() => this.load());
  }
}
