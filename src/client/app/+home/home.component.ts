import { Component, OnInit, OnDestroy} from '@angular/core';
import { ROUTER_DIRECTIVES, Router} from '@angular/router';
import { CurrentUser} from '../shared/services/current-user.model';
import { WzSearchBoxComponent} from '../shared/components/wz-search-box/wz.search-box.component';
import { UiConfig} from '../shared/services/ui.config';
import { SearchContext} from '../shared/services/search-context.service';
import { ApiConfig} from '../shared/services/api.config';
import { Subscription } from 'rxjs/Rx';
import { FilterService } from '../+search/services/filter.service';

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.html',
  directives: [ROUTER_DIRECTIVES, WzSearchBoxComponent]
})

export class HomeComponent implements OnInit, OnDestroy {
  public config: any;
  public configSubscription: Subscription;

  constructor(
    public currentUser: CurrentUser,
    public router: Router,
    public uiConfig: UiConfig,
    public searchContext: SearchContext,
    public apiConfig: ApiConfig,
    public filter: FilterService) {
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
}
