import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { CurrentUser} from '../shared/services/current-user.model';
import { UiConfig} from '../shared/services/ui.config';
import { SearchContext} from '../shared/services/search-context.service';
import { Subscription } from 'rxjs/Rx';
import { FilterService } from '../+search/services/filter.service';
import { UiState } from '../shared/services/ui.state';

@Component({
  moduleId: module.id,
  selector: 'home-component',
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
    public filter: FilterService,
    public uiState: UiState,
    private detector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.configSubscription = this.uiConfig.get('home').subscribe((config) => {
      this.config = config.config;
      this.detector.markForCheck();
    });
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public newSearchContext(query: any): void {
    this.filter.set(this.filter.clear());
    this.searchContext.new({ q: query, i: 1, n: this.config.pageSize.value });
  }

  public json(context: any): any {
    context = JSON.parse(context);
    for (let param in context) {
      if (context[param] === '') {
        delete (context[param]);
        return context;
      }
      return context;
    }
  }
}
