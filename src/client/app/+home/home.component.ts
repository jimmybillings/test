import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {CurrentUser} from '../shared/services/current-user.model';
import {SearchBoxComponent} from '../shared/components/search-box/search-box.component';
import {UiConfig} from '../shared/services/ui.config';
import {SearchContext} from '../shared/services/search-context.service';
import {ApiConfig} from '../shared/services/api.config';

@Component({
  selector: 'home',
  templateUrl: 'app/+home/home.html',
  directives: [ROUTER_DIRECTIVES, SearchBoxComponent],
  pipes: [TranslatePipe]
})

export class HomeComponent implements OnInit {
  public config: Object;

  constructor(
    public currentUser: CurrentUser,
    public router: Router,
    public uiConfig: UiConfig,
    public searchContext: SearchContext,
    public apiConfig: ApiConfig) {
  }

  ngOnInit() {
    this.uiConfig.get('home').subscribe((config) => this.config = config.config);
  }

  public newSearchContext(query: any): void { this.searchContext.new({ q: query, i: 1 }); }

}
