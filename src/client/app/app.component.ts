import {Component, HostListener, OnInit} from '@angular/core';
import {Routes, ROUTER_DIRECTIVES, Router} from '@angular/router';
import {Location} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {Observable} from 'rxjs/Rx';
import {MultilingualService} from './shared/services/multilingual.service';

// Interfaces
import {ILang} from './shared/interfaces/language.interface';

// Services
import {CurrentUser} from './shared/services/current-user.model';
import {Authentication} from './+user-management/services/authentication.data.service';
import {ApiConfig} from './shared/services/api.config';
import {UiConfig} from './shared/services/ui.config';
import {SearchContext} from './shared/services/search-context.service';

// Components
import {AppNavComponent} from './shared/components/app-nav/app-nav.component';
import {FooterComponent} from './shared/components/footer/footer.component';
import {NotificationComponent} from './shared/components/notification/notification.component';
import {SearchBoxComponent} from './shared/components/search-box/search-box.component';
import {BinTrayComponent} from './shared/components/bin-tray/bin-tray.component';

// Containers
import {UserManagementComponent} from './+user-management/user-management.component';
import {HomeComponent} from './+home/home.component';
import {ContentComponent} from './+content/content.component';
import {SearchComponent} from './+search/search.component';
import {AssetComponent} from './+asset/asset.component';
import {AdminComponent} from './+admin/admin.component';

@Component({
  selector: 'app',
  templateUrl: 'app/app.html',

  directives: [
    ROUTER_DIRECTIVES,
    AppNavComponent,
    FooterComponent,
    NotificationComponent,
    SearchBoxComponent,
    BinTrayComponent
  ],
  providers: [
    Authentication,
    SearchContext,
  ],
  pipes: [TranslatePipe],
})

@Routes([
  { path: '/', component: HomeComponent },
  { path: '/user', component: UserManagementComponent },
  { path: '/search', component: SearchComponent },
  { path: '/asset/:name', component: AssetComponent },
  { path: '/content/:page', component: ContentComponent },
  { path: '/admin', component: AdminComponent }
])

export class AppComponent implements OnInit {
  public header: any;
  public footer: Observable<any>;
  public searchBox: Observable<any>;
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  public showFixed: boolean = false;
  public state: string = '';
  public searchBarIsActive: boolean = true;
  public binTrayIsOpen: boolean = false;
  public searchIsOpen: boolean = true;

  @HostListener('document:scroll', ['$event.target']) onscroll(target: any) {
    this.showFixedHeader(window.pageYOffset);
  }

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
    this.uiConfig.initialize(this.apiConfig.getPortal()).subscribe();
    this.state = 'Home';
    this.router.changes.subscribe(() => {
      this.searchBarIsActive = this.checkRouteForSearchBar(this.location.path());
      this.state = this.location.path();
    });
    this.uiConfig.get('header').subscribe((data) => this.header = data.config);
    this.uiConfig.get('searchBox').subscribe(data => this.searchBox = data.config);
    this.currentUser.set();
  }

  public logout(): void {
    this.authentication.destroy().subscribe();
    this.currentUser.destroy();
    this.router.navigate(['/']);
  }

  public changeLang(data: any): void { this.multiLingual.setLanguage(data.lang); }

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

  public showFixedHeader(offset: any): void {
    let isfixed: boolean = this.showFixed;
    let setFixed: boolean = (offset > 111) ? true : false;
    if (setFixed !== isfixed) this.showFixed = !this.showFixed;
  }

  public checkRouteForSearchBar(currentState: string): boolean {
    if (currentState === '') return false;
    return ['user', 'admin']
      .filter((state) => currentState.indexOf(state) > -1).length === 0;
  }

  public newSearchContext(data: any): void { this.searchContext.new({ q: data, i: 1 }); }
}
