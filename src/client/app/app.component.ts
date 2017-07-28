import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/ignoreElements';
import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MultilingualService } from './shared/services/multilingual.service';

// Services
import { CurrentUserService } from './shared/services/current-user.service';
import { ApiConfig } from './shared/services/api.config';
import { UiConfig } from './shared/services/ui.config';
import { SearchContext } from './shared/services/search-context.service';
import { FilterService } from './shared/services/filter.service';
import { SortDefinitionsService } from './shared/services/sort-definitions.service';
import { CollectionsService } from './shared/services/collections.service';
import { UiState } from './shared/services/ui.state';
import { WzNotificationService } from './shared/services/wz.notification.service';
import { CartService } from './shared/services/cart.service';
import { QuoteEditService } from './shared/services/quote-edit.service';
import { UserPreferenceService } from './shared/services/user-preference.service';
import { Capabilities } from './shared/services/capabilities.service';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { WindowRef } from './shared/services/window-ref.service';
import { AppStore } from './app.store';

// /Interfaces
import { ILang } from './shared/interfaces/language.interface';
import { Collection } from './shared/interfaces/collection.interface';

@Component({
  moduleId: module.id,
  selector: 'wazee-digital-platform',
  templateUrl: 'app.html'
})

export class AppComponent implements OnInit {
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  public state: string = '';
  public userCan: Capabilities;
  private bootStrapUserDataSubscription: Subscription;

  constructor(
    public uiConfig: UiConfig,
    public router: Router,
    public multiLingual: MultilingualService,
    public searchContext: SearchContext,
    public currentUser: CurrentUserService,
    public collections: CollectionsService,
    public uiState: UiState,
    public userPreference: UserPreferenceService,
    private notification: WzNotificationService,
    private apiConfig: ApiConfig,
    private capabilities: Capabilities,
    private cartService: CartService,
    private window: WindowRef,
    private filter: FilterService,
    private sortDefinition: SortDefinitionsService,
    private snackBar: MdSnackBar,
    private translate: TranslateService,
    private zone: NgZone,
    private quoteEditService: QuoteEditService,
    private store: AppStore) {
    this.loadConfig();
    this.userCan = capabilities;
    zone.runOutsideAngular(() => {
      document.addEventListener('scroll', () => {
        this.uiState.showFixedHeader(this.window.nativeWindow.pageYOffset);
      });
    });
  }

  ngOnInit() {
    this.routerChanges();
    this.processUser();
  }

  public get activeCollection(): Observable<Collection> {
    return this.store.select(state => state.activeCollection.collection);
  }

  public get cartCount(): Observable<any> {
    if (this.userCan.administerQuotes()) {
      return this.quoteEditService.data.map((state) => state.data.itemCount);
    } else {
      return this.cartService.data.map((state) => state.data.itemCount);
    }
  }

  public logout(): void {
    this.currentUser.destroy();
  }

  public changeLang(data: any) {
    this.multiLingual.setLanguage(data);
  }

  public newSearchContext(query: any) {
    this.searchContext.remove = 'gq';
    let searchContext: any = Object.assign({}, this.searchContext.state, { q: query, i: 1, n: 100 });
    this.filter.load(searchContext, this.userPreference.state.displayFilterCounts).subscribe(() => { });
    this.searchContext.new(searchContext);
  }

  public toggleFilterTreePreference(): void {
    this.userPreference.toggleFilterTree();
  }

  public showSnackBar(message: any) {
    this.translate.get(message.key, message.value)
      .subscribe((res: string) => {
        this.snackBar.open(res, '', { duration: 2000 });
      });
  }

  private routerChanges() {
    this.router.events
      .filter((event: RoutesRecognized) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.uiState.checkRouteForSearchBar(event.url);
        this.uiState.checkForFilters(event.url);
        this.state = event.url;
        this.window.nativeWindow.scrollTo(0, 0);
      });
  }

  private processUser() {
    this.bootStrapUserDataSubscription = this.currentUser.loggedInState()
      .subscribe((loggedIn: boolean) => (loggedIn) ? this.processLoggedInUser() : this.processLoggedOutUser());
  }

  private processLoggedInUser() {
    this.userPreference.getPrefs();

    if (this.userCan.viewCollections()) {
      this.store.dispatch(factory => factory.activeCollection.load());

      this.store.blockUntil(state => state.activeCollection.loaded).subscribe(() => {
        this.collections.load().subscribe();
      });
    }

    if (this.userCan.administerQuotes()) {
      this.quoteEditService.getFocusedQuote().subscribe();
    } else {
      this.cartService.initializeData().subscribe();
    }

    this.sortDefinition.getSortDefinitions().subscribe((data: any) => {
      this.userPreference.updateSortPreference(data.currentSort.id);
    });
  }

  private processLoggedOutUser() {
    this.userPreference.reset();
    this.collections.destroyAll();
    this.uiState.reset();
    this.sortDefinition.getSortDefinitions().subscribe((data: any) => {
      this.userPreference.updateSortPreference(data.currentSort.id);
    });
  }

  private loadConfig() {
    if (this.uiConfig.hasLoaded()) {
      this.router.initialNavigation();
    } else {
      this.uiConfig.load().subscribe(() => this.router.initialNavigation());
    }
  }
}
