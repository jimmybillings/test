import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, Location} from 'angular2/router';
import {MultilingualService} from './common/services/multilingual.service';
import {ILang} from './common/interfaces/language.interface';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {Header} from './components/header/header.component';
import {Footer} from './components/footer/footer.component';
import {UserManagement} from './containers/user-management/user-management.component';
import {Home} from './containers/home/home.component';
import {Content} from './containers/content/content.component';
import {Search} from './containers/search/search.component';
import {Asset} from './containers/asset/asset.component';
import {CurrentUser} from './common/models/current-user.model';
import {Authentication} from './containers/user-management/services/authentication.data.service';
import {ApiConfig} from './common/config/api.config';
import {UiConfig} from './common/config/ui.config';
import {Notification} from './components/notification/notification.component';
import {Admin} from './containers/admin/admin.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app',
  templateUrl: './app.html',
  directives: [ROUTER_DIRECTIVES, Header, Footer, Notification],
  providers: [Authentication],
  pipes: [TranslatePipe],
})

@RouteConfig([
  { path: '/', name: 'Home', component: Home, useAsDefault: true },
  { path: '/user/...', component: UserManagement, name: 'UserManagement' },
  { path: '/search', component: Search, name: 'Search' },
  { path: '/asset/:name', component: Asset, name: 'Asset' },
  { path: '/content/:page', component: Content, name: 'Content' },
  { path: '/admin/...', component: Admin, name: 'Admin' }
])

export class AppComponent {
  public header: Observable<any>;
  public footer: Observable<any>;
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  public showFixed: boolean = false;
  public state: string = '';

  constructor(
    public currentUser: CurrentUser,
    private _apiConfig: ApiConfig,
    public uiConfig: UiConfig,
    private _authentication: Authentication,
    public router: Router,
    private _currentUser: CurrentUser,
    public multiLingual: MultilingualService,
    public location: Location) {

      this._apiConfig.setPortal('core');
      multiLingual.setLanguage(window.navigator.language.split('-')[0]);
      this.router.subscribe(state => this.state = state);
  }

  ngOnInit() {
    window.addEventListener('scroll', () => this.showFixedHeader(window.pageYOffset));
    this.uiConfig.initialize(this._apiConfig.getPortal())
      .subscribe(() => {
        this.header = this.uiConfig.get('header');
        this.footer = this.uiConfig.get('footer');
      });
    this.currentUser.set();
  }

  public logout(): void {
    this._authentication.destroy().subscribe();
    this._currentUser.destroy();
    this.router.navigate(['/Home']);
  }

  public changeLang(data): void {
    this.multiLingual.setLanguage(data.lang);
  }

  /**
   * Display a fixed header with different styling when the page scrolls down past 68 pixels.
   * @param offset  window scrolling offset value used to calcuate which header to display.
  */
  public showFixedHeader(offset): void {
    let isfixed: boolean = this.showFixed;
    let setFixed: boolean = (offset > 68) ? true : false;
    if (setFixed !== isfixed) this.showFixed = !this.showFixed;
  }

}
