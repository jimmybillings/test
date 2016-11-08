import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { CurrentUser} from '../shared/services/current-user.model';
import { UiConfig} from '../shared/services/ui.config';
import { SearchContext} from '../shared/services/search-context.service';
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
    public currentUser: CurrentUser,
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
    this.filter.set(this.filter.clear());
    this.searchContext.new({ q: query, i: 1, n: this.config.pageSize.value, sortId: this.userPreference.state.searchSortOptionId});
  }

  public buildSearchContext(context: any): any {
    context = JSON.parse(context);
    for (let param in context) {
      if (context[param] === '') delete (context[param]);
    }
    return context;
  }
}
