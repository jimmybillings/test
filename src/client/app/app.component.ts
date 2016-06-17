import {Component, OnInit, Renderer} from '@angular/core';
import {Routes, Router} from '@angular/router';
import {Location} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {Observable} from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import {MultilingualService} from './shared/services/multilingual.service';
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
  AdminComponent
} from './platform/app.component.imports';

// Portal is set as a global variable in the index.html page.
declare var portal: string;

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'app.html',
  directives: APP_COMPONENT_DIRECTIVES,
  pipes: [TranslatePipe],
})

@Routes([
  { path: '/', component: HomeComponent },
  { path: '/user', component: UserManagementComponent },
  { path: '/search', component: SearchComponent },
  { path: '/asset/:name', component: AssetComponent },
  { path: '/collection', component: CollectionComponent },
  { path: '/asset/:name', component: AssetComponent },
  { path: '/content/:page', component: ContentComponent },
  { path: '/admin', component: AdminComponent }
])

export class AppComponent implements OnInit {
  public header: Observable<any>;
  public searchBox: Observable<any>;
  public collectionFormConfig: Observable<any>;
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  public showFixed: boolean = false;
  public state: string = '';
  public searchBarIsActive: boolean = true;
  public binTrayIsOpen: boolean = false;
  public searchIsOpen: boolean = true;
  public newCollectionFormIsOpen: boolean = false;
  public collectionsListIsOpen: boolean = false;
  public collections: Observable<Array<Collection>>;
  public focusedCollection: Observable<any>;

  constructor(
    public uiConfig: UiConfig,
    public router: Router,
    public multiLingual: MultilingualService,
    public location: Location,
    public searchContext: SearchContext,
    private apiConfig: ApiConfig,
    private authentication: Authentication,
    private currentUser: CurrentUser,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    private renderer: Renderer) {
    this.apiConfig.setPortal(portal);
  }

  ngOnInit() {
    this.renderer.listenGlobal('document', 'scroll', () => this.showFixedHeader(window.pageYOffset));
    this.multiLingual.setLanguage(window.navigator.language.split('-')[0]);
    this.uiConfig.initialize(this.apiConfig.getPortal()).subscribe();
    this.currentUser.set();
    this.configChanges();
    this.routerChanges();

    this.collections = this.collectionsService.collections;
    this.focusedCollection = this.store.select('focusedCollection');
    this.currentUser._currentUser.subscribe(u => {
      this.UserHasFocusedCollection(u) ?
        this.getCollectionsAndFocused() :
        console.log('you don\'t have a focused collection');
    });
  }

  public configChanges() {
    this.uiConfig.get('header').subscribe((data) => this.header = data.config);
    this.uiConfig.get('searchBox').subscribe(data => this.searchBox = data.config);
    this.uiConfig.get('collection').subscribe((data) => this.collectionFormConfig = data.config);
  }

  public routerChanges() {
    this.router.changes.subscribe(() => {
      this.searchBarIsActive = this.checkRouteForSearchBar(this.location.path());
      this.state = this.location.path();
      // work around for scrolling to top when changing routes
      window.scrollTo(0, 0);
    });
  }

  public logout(): void {
    this.authentication.destroy().subscribe();
    this.currentUser.destroy();
    this.collectionsService.clearCollections();
    this.router.navigate(['/']);
  }

  public getCollectionsAndFocused(): void {
    this.collectionsService.loadCollections().subscribe(payload => {
      this.collectionsService.storeCollections(payload);
    });
    this.collectionsService.getFocusedCollection().subscribe(payload => {
      this.store.dispatch({ type: 'FOCUSED_COLLECTION', payload });
    });;
  }

  public UserHasFocusedCollection(user: any): boolean {
    return (user.hasOwnProperty('focusedCollection') && user.focusedCollection !== null) ? true : false;
  }

  public selectFocusedCollection(collection: Collection) {
    this.collectionsService.setFocusedCollection(collection).subscribe(payload => {
      this.store.dispatch({ type: 'FOCUSED_COLLECTION', payload: collection });
    });
    this.closeCollectionsList();
  }

  public goToCollections(): void {
    this.router.navigate(['/collection']);
  }

  public showNewCollection(): void {
    this.newCollectionFormIsOpen = true;
    this.closeCollectionsList();
  }

  public closeNewCollection(): void {
    this.newCollectionFormIsOpen = false;
  }

  public showCollectionsList(event: Event): void {
    this.collectionsListIsOpen = true;
  }

  public closeCollectionsList(): void {
    this.collectionsListIsOpen = false;
  }

  public createCollection(collection: Collection) {
    this.collectionsService.createCollection(collection).subscribe(payload => {
      this.collectionsService.store.dispatch({ type: 'CREATE_COLLECTION', payload });
    });
    this.getFocusedCollection();
    this.closeNewCollection();
  }

  public getFocusedCollection() {
    setTimeout(() => { this.collectionsService.getFocusedCollection().subscribe(payload => {
      this.store.dispatch({ type: 'FOCUSED_COLLECTION', payload });
    }); }, 1000);
  }

  public changeLang(data: any) { this.multiLingual.setLanguage(data.lang); }
  public closeBinTray() { this.binTrayIsOpen = false; }
  public openBinTray() { this.binTrayIsOpen = true; }
  public openSearch() { this.searchIsOpen = true; }
  public closeSearch() { this.searchIsOpen = false; }

  public showFixedHeader(offset: any) {
    let isfixed: boolean = this.showFixed;
    let setFixed: boolean = (offset > 111) ? true : false;
    if (setFixed !== isfixed) this.showFixed = !this.showFixed;
  }

  public checkRouteForSearchBar(currentState: string): boolean {
    if (currentState === '') return false;
    return ['user', 'admin']
      .filter((state) => currentState.indexOf(state) > -1).length === 0;
  }

  public newSearchContext(data: any) { this.searchContext.new({ q: data, i: 1 }); }
}
