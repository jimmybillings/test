import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, Location} from 'angular2/router';
import {MultilingualService} from './common/services/multilingual.service';
import {ILang} from './common/interfaces/language.interface';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {AppNav} from './components/app-nav/app-nav.component';
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
import {SearchBox} from './components/search-box/search-box.component';
import {BinTray} from './components/bin-tray/bin-tray.component';
import {SearchContext} from './common/services/search-context.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app',
  templateUrl: './app.html',
  directives: [ROUTER_DIRECTIVES, AppNav, Footer, Notification, SearchBox, BinTray],
  providers: [Authentication, SearchContext],
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
  public searchBox: Observable<any>;
  // public binTray: Observable<any>;
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  public showFixed: boolean = false;
  public state: string = '';
  public searchBarIsActive: boolean;
  public binTrayIsOpen: boolean = false;
  public searchIsOpen: boolean = true;

  constructor(
    public uiConfig: UiConfig,
    public router: Router,
    public multiLingual: MultilingualService,
    public location: Location,
    public searchContext: SearchContext,
    private apiConfig: ApiConfig,
    private authentication: Authentication,
    private currentUser: CurrentUser) {

      this.apiConfig.setPortal('core');
      multiLingual.setLanguage(window.navigator.language.split('-')[0]);
      
  }

  ngOnInit() {
    this.router.subscribe(state => {
      this.searchBarIsActive = this.checkRouteForSearchBar(this.router.currentInstruction.component.routeName);
      this.state = state;
    });
    window.addEventListener('scroll', () => this.showFixedHeader(window.pageYOffset));
    this.uiConfig.initialize(this.apiConfig.getPortal())
      .subscribe(() => {
        this.header = this.uiConfig.get('header');
        this.footer = this.uiConfig.get('footer');
        this.searchBox = this.uiConfig.get('searchBox');
        // this.binTray = this.uiConfig.get('binTray');
      });
    this.currentUser.set();
  }

  public logout(): void {
    this.authentication.destroy().subscribe();
    this.currentUser.destroy();
    this.router.navigate(['/Home']);
  }

  public changeLang(data): void { this.multiLingual.setLanguage(data.lang); }

  public closeBinTray(): void {
    this.binTrayIsOpen = false;
  }

  public closeSearch(): void {
    this.searchIsOpen = false;
  }
  public openBinTray(): void {
    this.binTrayIsOpen = true;
  }

  public openSearch(): void {
    this.searchIsOpen = true;
  }

  /**
   * Display a fixed header with different styling when the page scrolls down past 68 pixels.
   * @param offset  window scrolling offset value used to calcuate which header to display.
  */
  public showFixedHeader(offset): void {
    let isfixed: boolean = this.showFixed;
    let setFixed: boolean = (offset > 111) ? true : false;
    if (setFixed !== isfixed) this.showFixed = !this.showFixed;
  }
  /**
   * There are certain pages we don't want the searchbox to display on
   * @param currentState state that determines current page.
  */
  public checkRouteForSearchBar(currentState: string): boolean {
    return ['UserManagement', 'Home', 'Admin']
      .filter((state) => state.indexOf(currentState) > -1).length === 0;
  }
  
  public newSearchContext(data): void { this.searchContext.new({q: data, i: 1}); }
}
