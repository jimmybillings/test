import { Component, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterConfig, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { Observable } from 'rxjs/Rx';
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
  HomeComponent,
  UserManagementComponent,
  SearchComponent,
  AssetComponent,
  ContentComponent,
  CollectionsService,
  CollectionComponent,
  CollectionShowComponent,
  Collection,
  CollectionStore,
  AdminComponent,
  UiState,
  NotificationService
} from './platform/app.component.imports';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {USER_ROUTES} from './+user-management/user-management.component';
import {ADMIN_ROUTES} from './+admin/admin.component';
declare var portal: string;

export const APP_ROUTES: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'notification', component: HomeComponent },
  { path: 'user', component: UserManagementComponent, children: USER_ROUTES },
  { path: 'search', component: SearchComponent },
  { path: 'asset/:name', component: AssetComponent },
  { path: 'collection', component: CollectionComponent },
  { path: 'collection/:id', component: CollectionShowComponent },
  { path: 'content/:page', component: ContentComponent },
  { path: 'admin', component: AdminComponent, children: ADMIN_ROUTES }
];

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'app.html',
  directives: [ROUTER_DIRECTIVES, APP_COMPONENT_DIRECTIVES],
  pipes: [TranslatePipe],
  providers: [NotificationService]
})

export class AppComponent implements OnInit {
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  public state: string = '';
  public collections: Observable<Array<Collection>>;
  public focusedCollection: Observable<any>;
  @ViewChild('target', { read: ViewContainerRef }) target: any;

  constructor(
    public uiConfig: UiConfig,
    public router: Router,
    public multiLingual: MultilingualService,
    public location: Location,
    public searchContext: SearchContext,
    public currentUser: CurrentUser,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public uiState: UiState,
    private renderer: Renderer,
    private notification: NotificationService,
    private apiConfig: ApiConfig,
    private authentication: Authentication,
    private route: ActivatedRoute) {
    this.apiConfig.setPortal(portal);

  }

  ngOnInit() {
    this.renderer.listenGlobal('document', 'scroll', () => this.uiState.showFixedHeader(window.pageYOffset));
    this.multiLingual.setLanguage(window.navigator.language.split('-')[0]);
    this.uiConfig.initialize(this.apiConfig.getPortal()).subscribe();
    this.currentUser.set();
    this.routerChanges();
    this.focusedCollection = this.store.select('focusedCollection');
  }

  public routerChanges() {
    this.router.events.subscribe(event => {
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
    this.authentication.destroy().subscribe();
    this.currentUser.destroy();
    this.collectionsService.clearCollections();
    this.router.navigate(['/']);
  }

  public changeLang(data: any) { this.multiLingual.setLanguage(data.lang); }

  public newSearchContext(data: any) { this.searchContext.new({ q: data, i: 1 }); }
}
