import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { QuoteService } from '../../../shared/services/quote.service';
import { Quote } from '../../../shared/interfaces/commerce.interface';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { AppStore } from '../../../app.store';

@Injectable()
export class QuoteResolver implements Resolve<boolean> {
  constructor(private store: AppStore) { }

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.store.dispatch(factory => factory.quoteShow.load(parseInt(route.params.quoteId)));

    return this.store.blockUntil(state => !state.quoteShow.loading);
  }
}
