import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {MultilingualService} from './common/services/multilingual.service';
import {ILang} from './common/interfaces/language.interface';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
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
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  
  constructor(
    public currentUser: CurrentUser,
    private _apiConfig: ApiConfig,
    public uiConfig: UiConfig,
    private _authentication: Authentication,
    public router: Router,
    private _currentUser: CurrentUser,
    public multiLingual: MultilingualService) {
      this._apiConfig.setPortal('core');
      
      let userLang = window.navigator.language.split('-')[0];
      console.log(window.navigator.language);
      multiLingual.setLanguage(userLang);
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
  
  public changeLang(data): void {
    this.multiLingual.setLanguage(data.lang);
  }
}
