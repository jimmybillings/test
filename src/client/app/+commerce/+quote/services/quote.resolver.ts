import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { QuoteService } from '../../../shared/services/quote.service';

@Injectable()
export class QuoteResolver implements Resolve<any> {
  constructor(private quoteService: QuoteService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.quoteService.getQuote(parseInt(route.params['quoteId']));
  }
}
