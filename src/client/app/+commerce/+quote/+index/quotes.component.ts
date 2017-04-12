import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../shared/services/quotes.service';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { UiConfig } from '../../../shared/services/ui.config';
import { Quote, QuoteList } from '../../../shared/interfaces/quote.interface';

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
    public userCan: CommerceCapabilities,
    private quotesService: QuotesService,
    private uiConfig: UiConfig,
    private router: Router) {
    this.quotes = this.quotesService.data;
    this.buildFilterOptions();
    this.buildSortOptions();
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

  public onFilterResults(filter: any): void {
    this.currentFilter = filter;
    if (!filter.status) {
      delete this.params.status;
    } else {
      this.buildRouteParams(filter.status);
    }
    this.router.navigate(['/commerce/quotes', this.params]);
  }

  public onEditQuote(quoteId: number): void {
    this.quotesService.setFocused(quoteId).subscribe((quote: Quote) => {
      this.router.navigate(['/commerce/activeQuote']);
    });
  }

  public onSetAsFocusedQuote(quoteId: number): void {
    this.quotesService.setFocused(quoteId).subscribe();
  }

  private buildRouteParams(params: any) {
    this.params = Object.assign({}, this.params, params);
  }

  private buildSortOptions(): void {
    this.sortOptions = this.theSortOptions;
    this.currentSort = this.sortOptions[0].first;
  }

  private buildFilterOptions(): void {
    this.filterOptions = this.theFilterOptions;
    if (this.userCan.administerQuotes()) this.addPendingFilterOption();
    this.currentFilter = this.filterOptions[0].first;
  }

  private addPendingFilterOption(): void {
    this.filterOptions[1]['fifth'] = {
      'id': 5,
      'name': 'QUOTE.INDEX.FILTER.PENDING',
      'value': 'pending',
      'status': { 'status': 'PENDING' }
    };
  }

  private get theSortOptions(): any[] {
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
          'id': 5,
          'name': 'QUOTE.INDEX.SORT.EXPIRATION_DATE_DESC',
          'value': 'expirationDate',
          'sort': { 's': 'expirationDate', 'd': true }
        },
        'second': {
          'id': 6,
          'name': 'QUOTE.INDEX.SORT.EXPIRATION_DATE_ASC',
          'value': 'expirationDate',
          'sort': { 's': 'expirationDate', 'd': false }
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
          'value': 'all'
        }
      },
      {
        'first': {
          'id': 1,
          'name': 'QUOTE.INDEX.FILTER.ACTIVE',
          'value': 'active',
          'status': { 'status': 'ACTIVE' }
        },
        'second': {
          'id': 2,
          'name': 'QUOTE.INDEX.FILTER.ORDERED',
          'value': 'ordered',
          'status': { 'status': 'ORDERED' }
        },
        'third': {
          'id': 3,
          'name': 'QUOTE.INDEX.FILTER.EXPIRED',
          'value': 'expired',
          'status': { 'status': 'EXPIRED' }
        },
        'fourth': {
          'id': 4,
          'name': 'QUOTE.INDEX.FILTER.CANCELLED',
          'value': 'cancelled',
          'status': { 'status': 'CANCELLED' }
        }
      },
    ];
  }
}
