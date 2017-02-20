import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CurrentUserService } from '../shared/services/current-user.service';
import { UiConfig } from '../shared/services/ui.config';
import { SearchContext } from '../shared/services/search-context.service';
import { Subscription } from 'rxjs/Rx';
import { UiState } from '../shared/services/ui.state';
import { FilterService } from '../shared/services/filter.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';

@Component({
  moduleId: module.id,
  selector: 'home-component',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit, OnDestroy {
  public config: any;
  private configSubscription: Subscription;

  constructor(
    public currentUser: CurrentUserService,
    public uiState: UiState,
    private uiConfig: UiConfig,
    private searchContext: SearchContext,
    private userPreference: UserPreferenceService,
    private filter: FilterService) { }

  ngOnInit() {
    this.configSubscription = this.uiConfig.get('home').subscribe((config) => {
      this.config = config.config;
    });
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public newSearchContext(query: any): void {
    let searchContext: any = { q: query, i: 1, n: this.config.pageSize.value, sortId: this.userPreference.state.sortId };
    this.filter.clear();
    this.searchContext.new(searchContext);
  }

  // public buildSearchContext(context: any): any {
  //   context = JSON.parse(context);
  //   for (let param in context) {
  //     if (context[param] === '') delete (context[param]);
  //   }
  //   return context;
  // }
}
