import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Quote } from '../../shared/interfaces/commerce.interface';
import { FutureApiService } from '../services/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { AppStore } from '../../app.store';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/interfaces/user.interface';
import { CommerceCapabilities } from '../../+commerce/services/commerce.capabilities';

@Injectable()
export class FutureQuoteShowService {
  constructor(
    private apiService: FutureApiService,
    private store: AppStore,
    private userService: UserService,
    private userCan: CommerceCapabilities
  ) { }

  public load(quoteId: number): Observable<Quote> {
    return this.userCan.administerQuotes ? this.loadForAdminUser(quoteId) : this.loadForNonAdminUser(quoteId);
  }

  private loadForAdminUser(quoteId: number): Observable<Quote> {
    return this.apiService.get(Api.Orders, `quote/${quoteId}`, { loadingIndicator: true })
      .map((quote: Quote) => {
        let user: User;
        this.userService.getById(quote.ownerUserId).subscribe(u => user = u);
        return this.addRecipientToQuote(quote, user);
      });
  }

  private loadForNonAdminUser(quoteId: number): Observable<Quote> {
    return this.apiService.get(Api.Orders, `quote/${quoteId}`, { loadingIndicator: true });
  }

  private addRecipientToQuote(quote: Quote, user: User): Quote {
    return Object.assign(quote, {
      createdUserEmailAddress: user.emailAddress,
      createdUserFullName: `${user.firstName} ${user.lastName}`
    });
  }
}
