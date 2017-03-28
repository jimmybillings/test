import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../shared/services/quotes.service';
import { Capabilities } from '../../../shared/services/capabilities.service';
import { UiConfig } from '../../../shared/services/ui.config';

@Component({
  selector: 'quotes-component',
  templateUrl: 'quotes.html',
  moduleId: module.id
})
export class QuotesComponent {
  public quotes: any;
  public config: any;
  public sortOptions: any[];
  public currentSort: any;
  private params: any;
  constructor(
    public userCan: Capabilities,
    private quotesService: QuotesService,
    private uiConfig: UiConfig,
    private router: Router) {
    this.quotes = this.quotesService.data;
    this.config = this.uiConfig.get('cart').take(1).subscribe((config: any) => this.config = config.config);
    this.sortOptions = this.theSortOptions;
    this.currentSort = this.sortOptions[0].first;
  }

  public changePage(i: string): void {
    this.buildRouteParams({ i });
    this.router.navigate(['/commerce/quotes', this.params]);
  }

  public onSearch(query: { q: string }): void {
    this.buildRouteParams(Object.assign(query, { i: 1 }));
    this.router.navigate(['/commerce/quotes', this.params]);
  }

  public onSortResults(sort: any): void {
    this.currentSort = sort;
    this.buildRouteParams(sort.sort);
    this.router.navigate(['/commerce/quotes', this.params]);
  }

  private buildRouteParams(params: any) {
    this.params = Object.assign({}, this.params, { n: 20 }, params);
  }

  public get theSortOptions(): any {
    return [
      {
        'first': {
          'id': 0,
          'name': 'STATUS - (A-Z)',
          'value': 'statusAsc',
          'sort': { 's': 'quoteStatus', 'd': false }
        },
        'second': {
          'id': 1,
          'name': 'STATUS - (Z-A)',
          'value': 'statusDesc',
          'sort': { 's': 'quoteStatus', 'd': true }
        }
      },
      {
        'first': {
          'id': 2,
          'name': 'DATE CREATED - NEWEST FIRST',
          'value': 'createNewest',
          'sort': { 's': 'createdOn', 'd': true }
        },
        'second': {
          'id': 3,
          'name': 'DATE CREATED - OLDEST FIRST',
          'value': 'createOldest',
          'sort': { 's': 'createdOn', 'd': false }
        }
      }
    ];
  }
}
