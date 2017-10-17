import './operators';
import { Component, OnInit, HostListener, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { Router, RoutesRecognized, NavigationEnd, Event } from '@angular/router';
import { Observable } from 'rxjs/Observable';

// Services
import { CurrentUserService } from './shared/services/current-user.service';
import { SearchContext } from './shared/services/search-context.service';
import { FilterService } from './shared/services/filter.service';
import { SortDefinitionsService } from './shared/services/sort-definitions.service';
import { CollectionsService } from './shared/services/collections.service';
import { UserPreferenceService } from './shared/services/user-preference.service';
import { Capabilities } from './shared/services/capabilities.service';
import { WindowRef } from './shared/services/window-ref.service';
import { AppStore } from './app.store';
// /Interfaces
import { ILang } from './shared/interfaces/language.interface';

@Component({
  moduleId: module.id,
  selector: 'wazee-digital-platform',
  templateUrl: 'app.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit {
  public state: string = '';

  constructor(
    public router: Router,
    public searchContext: SearchContext,
    public currentUser: CurrentUserService,
    public collections: CollectionsService,
    public userPreference: UserPreferenceService,
    public userCan: Capabilities,
    private window: WindowRef,
    private filter: FilterService,
    private sortDefinition: SortDefinitionsService,
    private zone: NgZone,
    private store: AppStore
  ) {
    zone.runOutsideAngular(() => {
      document.addEventListener('scroll', () => {
        this.store.dispatch(factory => factory.headerDisplayOptions.setHeaderPosition(this.window.nativeWindow.pageYOffset));
      });
    });
  }

  ngOnInit() {
    this.loadConfig();
    this.routerChanges();
    this.processUser();
    this.store.dispatch(factory => factory.multiLingual.setLanguage('en'));
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

  public newSearchContext(query: any) {
    this.searchContext.remove = 'gq';
    let searchContext: any = Object.assign({}, this.searchContext.state, { q: query, i: 1, n: 100 });
    this.filter.load(searchContext, this.userPreference.state.displayFilterCounts).subscribe(() => { });
    this.searchContext.new(searchContext);
  }

  public toggleFilterTreePreference(): void {
    this.userPreference.toggleFilterTree();
  }

  public get headerIsFixed(): Observable<boolean> {
    return this.store.select(state => state.headerDisplayOptions.isFixed);
  }

  public get headerCanBeFixed(): Observable<boolean> {
    return this.store.select(state => state.headerDisplayOptions.canBeFixed);
  }

  public get headerConfig(): Observable<any> {
    return this.store.select(state => state.uiConfig)
      .filter(state => state.loaded)
      .map(state => state.components.header.config).take(1);
  }

  public get searchBoxConfig(): Observable<any> {
    return this.store.select(state => state.uiConfig)
      .filter(state => state.loaded)
      .map(state => state.components.searchBox.config).take(1);
  }

  private routerChanges() {
    this.router.events
      .filter((event: Event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.store.dispatch(factory => factory.headerDisplayOptions.checkIfHeaderCanBeFixed(event.url));
        this.store.dispatch(factory => factory.headerDisplayOptions.checkIfFiltersAreAvailable(event.url));
        this.state = event.url;
        this.window.nativeWindow.scrollTo(0, 0);
      });
  }

  private processUser() {
    this.currentUser.loggedInState()
      .subscribe((loggedIn: boolean) => (loggedIn) ?
        this.processLoggedInUser() : this.processLoggedOutUser());
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
    this.store.dispatch(factory => factory.headerDisplayOptions.reset());
    this.sortDefinition.getSortDefinitions().subscribe((data: any) => {
      this.userPreference.updateSortPreference(data.currentSort.id);
    });
  }

  private loadConfig() {
    if (this.store.snapshot(state => state.uiConfig.loaded)) {
      this.router.initialNavigation();
    } else {
      this.store.dispatch(factory => factory.uiConfig.load());
    }
  }
}
