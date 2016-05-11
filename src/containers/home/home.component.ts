import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {NgIf} from 'angular2/common';
import {CurrentUser} from '../../common/models/current-user.model';
import {SearchBox} from '../../components/search-box/search-box.component';
import {UiConfig} from '../../common/config/ui.config';
import {SearchContext} from '../../common/services/search-context.service';
import {ApiConfig} from '../../common/config/api.config';

@Component({
  selector: 'home',
  templateUrl: 'containers/home/home.html',
  directives: [ROUTER_DIRECTIVES, NgIf, SearchBox],
  pipes: [TranslatePipe]
})

export class Home {
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
  
  public newSearchContext(query): void { this.searchContext.new({q: query, i: 1}); }
  
}
