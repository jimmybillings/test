import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';

@Injectable()
export class QuoteEditResolver implements Resolve<any> {
  constructor(private quoteEditService: QuoteEditService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.quoteEditService.getFocusedQuote();
  }
}
