import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {NgIf} from 'angular2/common';
import {CurrentUser} from '../../common/models/current-user.model';
import {SearchBox} from '../../components/search-box/search-box.component';
import {UiConfig} from '../../common/config/ui.config';

/**
 * Home page component - renders the home page
 */  
@Component({
  selector: 'home',
  templateUrl: 'containers/home/home.html',
  directives: [ROUTER_DIRECTIVES, NgIf, SearchBox],
  pipes: [TranslatePipe]
})

export class Home {
  public config: Object;
  public components: Object;
  
  constructor(
    public currentUser: CurrentUser,
    public router: Router,
    public uiConfig: UiConfig) {
  }
  
  ngOnInit() {
    this.uiConfig.get('home').subscribe((config) => {
      this.components = config.components;
      this.config = config.config;
    }); 
  }
  
  public newSearchContext(data) {
    this.router.navigate(['/Search', { q: data, n: 100 }]);
  }
  
}
