import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { QuoteService } from '../../../shared/services/quote.service';
import { Quote } from '../../../shared/interfaces/commerce.interface';
import { CommerceCapabilities } from '../../services/commerce.capabilities';

@Injectable()
export class QuoteResolver implements Resolve<Quote> {
  constructor(private quoteService: QuoteService, private userCan: CommerceCapabilities) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Quote> {
    return this.quoteService.load(parseInt(route.params['quoteId']), this.userCan.administerQuotes());
  }
}
