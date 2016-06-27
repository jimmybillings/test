import { Component, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Routes, Router } from '@angular/router';
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
  Collection,
  CollectionStore,
  AdminComponent,
  UiState
} from './platform/app.component.imports';
// import { NotificationComponent, notficationState } from './shared/components/notification/notification.component';
import { NotificationService } from './shared/components/notification/notification.service';

// Portal is set as a global variable in the index.html page.
declare var portal: string;

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'app.html',
  directives: APP_COMPONENT_DIRECTIVES,
  pipes: [TranslatePipe],
  providers: [NotificationService]
})

@Routes([
  { path: '/', component: HomeComponent },
  { path: '/notification', component: HomeComponent },
  { path: '/user', component: UserManagementComponent },
  { path: '/search', component: SearchComponent },
  { path: '/asset/:name', component: AssetComponent },
  { path: '/collection', component: CollectionComponent },
  { path: '/collection/:id', component: CollectionComponent },
  { path: '/content/:page', component: ContentComponent },
  { path: '/admin', component: AdminComponent }
])

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
    private apiConfig: ApiConfig,
    private authentication: Authentication,
    public currentUser: CurrentUser,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public uiState: UiState,
    private renderer: Renderer,
    private notification: NotificationService) {
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
    this.router.changes.subscribe(() => {
      this.uiState.checkRouteForSearchBar(this.location.path());
      this.state = this.location.path();
      window.scrollTo(0, 0);
      this.notification.check(this.state, this.target);
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
