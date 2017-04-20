import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { QuoteService } from '../../../shared/services/quote.service';
import { Quote } from '../../../shared/interfaces/commerce.interface';

@Injectable()
export class QuoteResolver implements Resolve<Quote> {
  constructor(private quoteService: QuoteService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Quote> {
    return this.quoteService.getQuote(parseInt(route.params['quoteId']));
  }
}
