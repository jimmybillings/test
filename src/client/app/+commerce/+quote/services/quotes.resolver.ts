import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { QuotesService } from '../../../shared/services/quotes.service';

@Injectable()
export class QuotesResolver implements Resolve<any> {
  constructor(private quotesService: QuotesService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.quotesService.getQuotes();
  }
}
