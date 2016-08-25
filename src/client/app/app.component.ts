import { Component, OnInit, Renderer, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { MultilingualService } from './shared/services/multilingual.service';

// Services
import { CurrentUser} from './shared/services/current-user.model';
import { UserPermission } from './shared/services/permission.service';
import { ApiConfig} from './shared/services/api.config';
import { UiConfig} from './shared/services/ui.config';
import { SearchContext} from './shared/services/search-context.service';
import { Authentication} from './+user-management/services/authentication.data.service';
import { CollectionsService } from './+collection/services/collections.service';
import { UiState} from './shared/services/ui.state';
import { WzNotificationService } from './shared/components/wz-notification/wz.notification.service';
import { ActiveCollectionService} from './+collection/services/active-collection.service';

// /Interfaces
import { ILang} from './shared/interfaces/language.interface';
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

  public changeLang(data: any) { this.multiLingual.setLanguage(data); }

  public newSearchContext(data: any) {
    this.searchContext.update = { q: data, i: 1, n: 100 };
    this.searchContext.go();
  }
}
