import { Component, OnInit, Renderer, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { Observable, Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { MultilingualService } from './shared/services/multilingual.service';
import {
  APP_COMPONENT_DIRECTIVES,
  CurrentUser,
  ApiConfig,
  UiConfig,
  SearchContext,
  Authentication,
  ILang,
  Collection,
  CollectionStore,
  UiState,
  WzNotificationService,
  CollectionsService,
  UserPermission,
  ActiveCollectionService
} from './imports/app.component.imports';
declare var portal: string;

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'app.html',
  directives: [ROUTER_DIRECTIVES, APP_COMPONENT_DIRECTIVES],
  pipes: [TranslatePipe],
  providers: [WzNotificationService]
})

export class AppComponent implements OnInit, OnDestroy {
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  public state: string = '';
  public collections: Observable<Array<Collection>>;
  private configSubscription: Subscription;
  private routeSubscription: Subscription;
  private authSubscription: Subscription;
  @ViewChild('target', { read: ViewContainerRef }) private target: any;

  constructor(
    public uiConfig: UiConfig,
    public router: Router,
    public multiLingual: MultilingualService,
    public searchContext: SearchContext,
    public currentUser: CurrentUser,
    public permission: UserPermission,
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService,
    public store: Store<CollectionStore>,
    public uiState: UiState,
    private renderer: Renderer,
    private notification: WzNotificationService,
    private apiConfig: ApiConfig,
    private authentication: Authentication) {
    this.apiConfig.setPortal(portal);
  }

  ngOnInit() {
    this.renderer.listenGlobal('document', 'scroll', () => this.uiState.showFixedHeader(window.pageYOffset));
    this.configSubscription = this.uiConfig.initialize(this.apiConfig.getPortal()).subscribe();
    this.currentUser.set();
    this.routerChanges();
    this.initializeCollections();
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  public routerChanges() {
    this.routeSubscription = this.router.events.subscribe(event => {
      var results = (/function (.{1,})\(/).exec((event).constructor.toString());
      if (results[1] === 'NavigationEnd') {
        this.uiState.checkRouteForSearchBar(event.url);
        this.state = event.url;
        window.scrollTo(0, 0);
        this.notification.check(this.state, this.target);
      }
    });
  }

  public logout(): void {
    this.authSubscription = this.authentication.destroy().subscribe();
    this.currentUser.destroy();
    this.collectionsService.destroyCollections();
    this.uiState.reset();
  }

  public initializeCollections() {
    this.currentUser.loggedInState().subscribe((loggedIn: any) => {
      if (loggedIn && this.permission.has('ViewCollections')) {
        this.activeCollection.get().take(1).subscribe((collection) => {
          this.activeCollection.getItems(collection.id, 300).take(1).subscribe();
          this.collectionsService.loadCollections().take(1).subscribe();
        });
      }
    });
  }

  public changeLang(data: any) { this.multiLingual.setLanguage(data); }

  public newSearchContext(data: any) { this.searchContext.new({ q: data, i: 1 }); }
}
