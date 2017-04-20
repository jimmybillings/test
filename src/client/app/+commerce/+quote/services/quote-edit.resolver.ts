import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';
import { Quote } from '../../../shared/interfaces/commerce.interface';

@Injectable()
export class QuoteEditResolver implements Resolve<Quote> {
  constructor(private quoteEditService: QuoteEditService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Quote> {
    return this.quoteEditService.getFocusedQuote();
  }
}
