import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../shared/services/quotes.service';
import { Capabilities } from '../../../shared/services/capabilities.service';
import { UiConfig } from '../../../shared/services/ui.config';
import { Quote } from '../../../shared/interfaces/quote.interface';

@Component({
  selector: 'quotes-component',
  templateUrl: 'quotes.html',
  moduleId: module.id
})
export class QuotesComponent {
  public quotes: any;
  public config: any;
  public sortOptions: any[];
  public filterOptions: any[];
  public currentSort: any;
  public currentFilter: any;
  private params: any;
  constructor(
    public userCan: Capabilities,
    private quotesService: QuotesService,
    private uiConfig: UiConfig,
    private router: Router) {
    this.quotes = this.quotesService.data;
    this.sortOptions = this.theSortOptions;
    this.filterOptions = this.theFilterOptions;
    this.currentSort = this.sortOptions[0].first;
    this.currentFilter = this.filterOptions[0].first;
    this.config = this.uiConfig.get('cart')
      .take(1).subscribe((config: any) => this.config = config.config);
  }

  public changePage(i: string): void {
    this.buildRouteParams({ i });
    this.router.navigate(['/commerce/quotes', this.params]);
  }

  public onSortResults(sort: any): void {
    this.currentSort = sort;
    this.buildRouteParams(sort.sort);
    this.router.navigate(['/commerce/quotes', this.params]);
  }

  public onSearch(query: { q: string }): void {
    this.buildRouteParams(query);
    this.quotesService.getQuotes(this.params).subscribe();
  }

  public onFilterResults(filter: any): void {
    this.currentFilter = filter;
    this.buildRouteParams(filter.status);
    this.quotesService.getQuotes(this.params).subscribe();
  }

  public onEditQuote(quote: Quote): void {
    console.log(quote);
  }

  public onSetAsFocusedQuote(quote: Quote): void {
    console.log(quote);
  }

  private buildRouteParams(params: any) {
    this.params = Object.assign({}, this.params, { n: 20 }, params);
  }

  public get theSortOptions(): any[] {
    return [
      {
        'first': {
          'id': 1,
          'name': 'QUOTE.INDEX.SORT.DATE_CREATED_DESC',
          'value': 'createdNewestFirst',
          'sort': { 's': 'createdOn', 'd': true }
        },
        'second': {
          'id': 2,
          'name': 'QUOTE.INDEX.SORT.DATE_CREATED_ASC',
          'value': 'createdOldestFirst',
          'sort': { 's': 'createdOn', 'd': false }
        }
      },
      {
        'first': {
          'id': 3,
          'name': 'QUOTE.INDEX.SORT.STATUS_ASC',
          'value': 'statusAsc',
          'sort': { 's': 'quoteStatus', 'd': false }
        },
        'second': {
          'id': 4,
          'name': 'QUOTE.INDEX.SORT.STATUS_DESC',
          'value': 'statusDesc',
          'sort': { 's': 'quoteStatus', 'd': true }
        }
      },
      {
        'first': {
          'id': 6,
          'name': 'QUOTE.INDEX.SORT.CREATOR_EMAIL_ADDRESS_ASC',
          'value': 'createdEmailAddress',
          'sort': { 's': 'createdEmailAddress', 'd': false }
        },
        'second': {
          'id': 5,
          'name': 'QUOTE.INDEX.SORT.CREATOR_EMAIL_ADDRESS_DESC',
          'value': 'createdEmailAddress',
          'sort': { 's': 'createdEmailAddress', 'd': true }
        }
      },
      {
        'first': {
          'id': 7,
          'name': 'QUOTE.INDEX.SORT.EXPIRATION_DATE_ASC',
          'value': 'expirationDate',
          'sort': { 's': 'expirationDate', 'd': false }
        },
        'second': {
          'id': 8,
          'name': 'QUOTE.INDEX.SORT.EXPIRATION_DATE_DESC',
          'value': 'expirationDate',
          'sort': { 's': 'expirationDate', 'd': true }
        }
      }
    ];
  }

  private get theFilterOptions(): any[] {
    return [
      {
        'first': {
          'id': 0,
          'name': 'QUOTE.INDEX.FILTER.ALL',
          'value': 'all',
          'status': { 'status': 'all' }
        }
      },
      {
        'first': {
          'id': 1,
          'name': 'QUOTE.INDEX.FILTER.PENDING',
          'value': 'pending',
          'status': { 'status': 'pending' }
        },
        'second': {
          'id': 2,
          'name': 'QUOTE.INDEX.FILTER.ACTIVE',
          'value': 'active',
          'status': { 'status': 'active' }
        },
        'third': {
          'id': 3,
          'name': 'QUOTE.INDEX.FILTER.ORDERED',
          'value': 'ordered',
          'status': { 'status': 'ordered' }
        },
        'fourth': {
          'id': 4,
          'name': 'QUOTE.INDEX.FILTER.EXPIRED',
          'value': 'expired',
          'status': { 'status': 'expired' }
        },
        'fifth': {
          'id': 5,
          'name': 'QUOTE.INDEX.FILTER.CANCELLED',
          'value': 'cancelled',
          'status': { 'status': 'cancelled' }
        }
      },
    ];
  }
}
