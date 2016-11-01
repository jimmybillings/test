import { Component, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { MultilingualService } from './shared/services/multilingual.service';
// Services
import { CurrentUser } from './shared/services/current-user.model';
import { ApiConfig } from './shared/services/api.config';
import { UiConfig } from './shared/services/ui.config';
import { SearchContext } from './shared/services/search-context.service';
import { Authentication } from './shared/services/authentication.data.service';

import { CollectionsService } from './shared/services/collections.service';
import { UiState } from './shared/services/ui.state';
import { WzNotificationService } from './shared/components/wz-notification/wz.notification.service';
import { ActiveCollectionService } from './shared/services/active-collection.service';
import { CartSummaryService } from './shared/services/cart-summary.service';
import { UserPreferenceService } from './shared/services/user-preference.service';
import { Capabilities } from './shared/services/capabilities.service';

// /Interfaces
import { ILang } from './shared/interfaces/language.interface';

declare var portal: string;

@Component({
  moduleId: module.id,
  selector: 'wazee-digital-platform',
  templateUrl: 'app.html',
  providers: [WzNotificationService]
})

export class AppComponent implements OnInit {
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  public state: string = '';
  private bootStrapUserDataSubscription: Subscription;

  @ViewChild('target', { read: ViewContainerRef }) private target: any;

  constructor(
    public uiConfig: UiConfig,
    public router: Router,
    public multiLingual: MultilingualService,
    public searchContext: SearchContext,
    public currentUser: CurrentUser,
    public collections: CollectionsService,
    public activeCollection: ActiveCollectionService,
    public uiState: UiState,
    public userPreference: UserPreferenceService,
    private renderer: Renderer,
    private notification: WzNotificationService,
    private apiConfig: ApiConfig,
    private authentication: Authentication,
    private userCan: Capabilities,
    private cartSummary: CartSummaryService,
    private window: Window) {}

  ngOnInit() {
    this.apiConfig.setPortal(portal);
    this.currentUser.set();
    this.renderer.listenGlobal('document', 'scroll', () => this.uiState.showFixedHeader(this.window.pageYOffset));
    this.uiConfig.initialize(this.currentUser.loggedIn(), this.apiConfig.getPortal()).subscribe();
    this.routerChanges();
    this.processUser();
  }

  public logout(): void {
    this.authentication.destroy().subscribe();
    this.currentUser.destroy();
  }

  public changeLang(data: any) {
    this.multiLingual.setLanguage(data);
  }

  public newSearchContext(data: any) {
    this.searchContext.update = { q: data, i: 1, n: 100, sortId: this.userPreference.state.searchSortOptionId };
    this.searchContext.go();
  }

  private routerChanges() {
    this.router.events
      .filter((event: RoutesRecognized) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.uiState.checkRouteForSearchBar(event.url);
        this.uiState.checkForFilters(event.url);
        this.state = event.url;
        this.window.scrollTo(0, 0);
        this.notification.check(this.state, this.target);
      });
  }

  private processUser() {
    this.bootStrapUserDataSubscription = this.currentUser.loggedInState()
      .subscribe((loggedIn: boolean) => (loggedIn) ? this.processLoggedInUser() : this.processLoggedOutUser());
  }

  private processLoggedInUser() {
    this.userPreference.getPrefs();
    if (this.userCan.viewCollections()) {
      this.activeCollection.get().take(1).subscribe((collection) => {
        this.activeCollection.getItems(collection.id, { i: 1, n: 100 }, true, false).take(1).subscribe();
        this.collections.load().take(1).subscribe();
      });
    }
    this.cartSummary.loadCartSummary();
  }

  private processLoggedOutUser() {
    this.collections.destroyAll();
    this.uiState.reset();
    this.userPreference.reset();
  }
}
