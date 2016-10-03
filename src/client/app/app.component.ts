import { Component, OnInit, Renderer, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { MultilingualService } from './shared/services/multilingual.service';
import { ErrorActions } from './shared/services/error.service';
// Services
import { CurrentUser} from './shared/services/current-user.model';
import { ApiConfig} from './shared/services/api.config';
import { UiConfig} from './shared/services/ui.config';
import { SearchContext} from './shared/services/search-context.service';
import { Authentication} from './+user-management/services/authentication.data.service';

import { CollectionsService } from './+collection/services/collections.service';
import { UiState } from './shared/services/ui.state';
import { WzNotificationService } from './shared/components/wz-notification/wz.notification.service';
import { ActiveCollectionService } from './+collection/services/active-collection.service';
import { CartSummaryService } from './shared/services/cart-summary.service';
import { UserPreferenceService } from './shared/services/user-preference.service';
import { Capabilities } from './shared/services/capabilities.service';

// /Interfaces
import { ILang } from './shared/interfaces/language.interface';
import { Collection, CollectionStore } from './shared/interfaces/collection.interface';

declare var portal: string;

@Component({
  moduleId: module.id,
  selector: 'wazee-digital-platform',
  templateUrl: 'app.html',
  providers: [WzNotificationService]
})

export class AppComponent implements OnInit, OnDestroy {
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  public state: string = '';
  public collections: Observable<Array<Collection>>;
  private routeSubscription: Subscription;
  private authSubscription: Subscription;
  private bootStrapUserDataSubscription: Subscription;

  @ViewChild('target', { read: ViewContainerRef }) private target: any;

  constructor(
    public uiConfig: UiConfig,
    public router: Router,
    public multiLingual: MultilingualService,
    public searchContext: SearchContext,
    public currentUser: CurrentUser,
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService,
    public store: Store<CollectionStore>,
    public uiState: UiState,
    public preferences: UserPreferenceService,
    private renderer: Renderer,
    private notification: WzNotificationService,
    private apiConfig: ApiConfig,
    private authentication: Authentication,
    private userCan: Capabilities,
    private cartSummary: CartSummaryService,
    private errorActions: ErrorActions) {
    this.apiConfig.setPortal(portal);
    this.currentUser.set();
  }

  ngOnInit() {
    this.renderer.listenGlobal('document', 'scroll', () => this.uiState.showFixedHeader(window.pageYOffset));
    this.uiConfig.initialize(this.currentUser.loggedIn(), this.apiConfig.getPortal()).subscribe();
    this.routerChanges();
    this.bootStrapUserData();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    this.bootStrapUserDataSubscription.unsubscribe();
  }

  public routerChanges() {
    this.routeSubscription = this.router.events
      .filter((event: RoutesRecognized) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.uiState.checkRouteForSearchBar(event.url);
        this.state = event.url;
        window.scrollTo(0, 0);
        console.log(this.state);
        this.notification.check(this.state, this.target);
      });
  }

  public logout(): void {
    this.authSubscription = this.authentication.destroy().subscribe();
    this.currentUser.destroy();
    this.collectionsService.destroyCollections();
    this.uiState.reset();
  }

  public changeLang(data: any) {
    this.multiLingual.setLanguage(data);
  }

  public newSearchContext(data: any) {
    this.searchContext.update = { q: data, i: 1, n: 100 };
    this.searchContext.go();
  }

  public bootStrapUserData() {
    this.bootStrapUserDataSubscription = this.currentUser.loggedInState()
      .filter((loggedIn: boolean) => loggedIn)
      .subscribe(() => {
        if(this.userCan.viewCollections()) {
          this.activeCollection.get().take(1).subscribe((collection) => {
            this.activeCollection.getItems(collection.id, { i: 1, n: 100 }, true, false).take(1).subscribe();
            this.collectionsService.loadCollections().take(1).subscribe();
          });
        }
        if(this.userCan.viewCart()) {
          this.cartSummary.loadCartSummary();
        }
      });
  }
}
