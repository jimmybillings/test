import './operators';
import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { Router, RoutesRecognized, NavigationEnd, Event } from '@angular/router';
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
import { UserPreferenceService } from './shared/services/user-preference.service';
import { Capabilities } from './shared/services/capabilities.service';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { WindowRef } from './shared/services/window-ref.service';
import { AppStore } from './app.store';
import { enhanceAsset } from './shared/interfaces/enhanced-asset';
// /Interfaces
import { ILang } from './shared/interfaces/language.interface';
import { Collection } from './shared/interfaces/collection.interface';
import { Common } from './shared/utilities/common.functions';

@Component({
  moduleId: module.id,
  selector: 'wazee-digital-platform',
  templateUrl: 'app.html'
})

export class AppComponent implements OnInit {
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  public state: string = '';
  public userCan: Capabilities;
  public activeCollection: Collection;
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
    private apiConfig: ApiConfig,
    private capabilities: Capabilities,
    private window: WindowRef,
    private filter: FilterService,
    private sortDefinition: SortDefinitionsService,
    private snackBar: MdSnackBar,
    private translate: TranslateService,
    private zone: NgZone,
    private store: AppStore
  ) {
    this.loadConfig();
    this.loadActiveCollection();
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

  public loadActiveCollection(): void {
    this.store.select(state => state.activeCollection)
      .filter(state => state.collection !== undefined)
      .map(state => {
        let collection: Collection = Common.clone(state.collection);
        if (collection.assets && collection.assets.items) {
          collection.assets.items = collection.assets.items
            .map(item => enhanceAsset(item, 'collectionAsset', collection.id));
        }
        return collection;
      })
      .subscribe(collection => this.activeCollection = collection);
  }

  public get cartCount(): Observable<any> {
    if (this.userCan.administerQuotes()) {
      return this.store.select(state => state.quoteEdit.data.itemCount);
    } else {
      return this.store.select(state => state.cart.data.itemCount);
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
      .filter((event: Event) => event instanceof NavigationEnd)
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

    if (this.userCan.administerQuotes()) {
      this.store.dispatch(factory => factory.quoteEdit.load());
    } else {
      this.store.dispatch(factory => factory.cart.load());
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
