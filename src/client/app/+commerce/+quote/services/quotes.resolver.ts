import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { QuotesService } from '../../../shared/services/quotes.service';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { Common } from '../../../shared/utilities/common.functions';

@Injectable()
export class QuotesResolver implements Resolve<any> {
  constructor(private quotesService: QuotesService, private userCan: CommerceCapabilities) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (this.userCan.administerQuotes()) {
      return this.quotesService.getQuotes(true, Common.clone(route.params));
    } else {
      return this.quotesService.getQuotes(false, Common.clone(route.params));
    }
  }
}
