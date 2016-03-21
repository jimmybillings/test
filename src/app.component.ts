import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import { TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {Header} from './components/header/header.component';
import {Footer} from './components/footer/footer.component';
import {UserManagement} from './containers/user-management/user-management.component';
import {Home} from './containers/home/home.component';
import {Search} from './containers/search/search.component';
import {CurrentUser} from './common/models/current-user.model';
import {Authentication} from './containers/user-management/services/authentication.data.service';
import {ApiConfig} from './common/config/api.config';
import {UiConfig} from './common/config/ui.config';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app',
  templateUrl: './app.html',
  directives: [ROUTER_DIRECTIVES, Header, Footer],
  providers: [Authentication],
  pipes: [TranslatePipe]

})

@RouteConfig([
  { path: '/', name: 'Home', component: Home, useAsDefault: true },
  { path: '/user/...', component: UserManagement, name: 'UserManagement' },
  { path: '/search', component: Search, name: 'Search' },
])

export class AppComponent {
  public header: Observable<any>;
  public footer: Observable<any>;
  
  constructor(
    public currentUser: CurrentUser,
    private _apiConfig: ApiConfig,
    public uiConfig: UiConfig,
    private _authentication: Authentication,
    public router: Router, 
    private _currentUser: CurrentUser,
    public translate: TranslateService) {
    this._apiConfig.setPortal('core');
    
    var userLang = navigator.language.split('-')[0]; // use navigator lang if available
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'en';

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(userLang);
  }

  ngOnInit() {
    this.uiConfig.initialize(this._apiConfig.getPortal())
      .subscribe(() => {        
        this.header = this.uiConfig.get('header');
        this.footer = this.uiConfig.get('footer');
      });
    
    this.currentUser.set();
  }
  
  public logout(): void {
    this._authentication.destroy().subscribe();
    localStorage.clear();
    this._currentUser.set();
    this.router.navigate(['/Home']);
  }
}
