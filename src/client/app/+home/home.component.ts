import { Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { CurrentUser} from '../shared/services/current-user.model';
import { UiConfig} from '../shared/services/ui.config';
import { SearchContext} from '../shared/services/search-context.service';
import { ApiConfig} from '../shared/services/api.config';
import { Subscription } from 'rxjs/Rx';
import { FilterService } from '../+search/services/filter.service';
import { UiState } from '../shared/services/ui.state';

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit, OnDestroy {
  public config: any;
  public configSubscription: Subscription;

  constructor(
    public currentUser: CurrentUser,
    public uiConfig: UiConfig,
    public searchContext: SearchContext,
    public apiConfig: ApiConfig,
    public filter: FilterService,
    public uiState: UiState) {
  }

  ngOnInit() {
    this.configSubscription = this.uiConfig.get('home').subscribe((config) => this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public newSearchContext(query: any): void {
    this.filter.set(this.filter.clear());
    this.searchContext.new({ q: query, i: 1, n: this.config.pageSize.value });
  }

  public json(string: string): any {
    return JSON.parse(string);
  }
}
