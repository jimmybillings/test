import {Component, HostListener, OnInit} from '@angular/core';
import {Routes, Router} from '@angular/router';
import {Location} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {Observable} from 'rxjs/Rx';
import {MultilingualService} from './shared/services/multilingual.service';
// Portal is set as a global variable in the index.html page. 
// It is the only unique part of the app component file for each portal
// by taking it out we can now put the app component into the library.
declare var portal: string;

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
  AdminComponent
} from './platform/app.component.imports';

@Component({
  selector: 'app',
  templateUrl: 'app/app.html',
  directives: APP_COMPONENT_DIRECTIVES,
  pipes: [TranslatePipe],
})

@Routes([
  { path: '/', component: HomeComponent },
  { path: '/user', component: UserManagementComponent },
  { path: '/search', component: SearchComponent },
  { path: '/asset/:name', component: AssetComponent },
  { path: '/content/:page', component: ContentComponent },
  { path: '/admin', component: AdminComponent }
])

export class AppComponent implements OnInit {
  public header: any;
  public footer: Observable<any>;
  public searchBox: Observable<any>;
  public supportedLanguages: Array<ILang> = MultilingualService.SUPPORTED_LANGUAGES;
  public showFixed: boolean = false;
  public state: string = '';
  public searchBarIsActive: boolean = true;
  public binTrayIsOpen: boolean = false;
  public searchIsOpen: boolean = true;

  @HostListener('document:scroll', ['$event.target']) onscroll(target: any) {
    this.showFixedHeader(window.pageYOffset);
  }
  constructor(
    public uiConfig: UiConfig,
    public router: Router,
    public multiLingual: MultilingualService,
    public location: Location,
    public searchContext: SearchContext,
    private apiConfig: ApiConfig,
    private authentication: Authentication,
    private currentUser: CurrentUser) {
  }

  ngOnInit() {
    // document.querySelector('md-sidenav-layout').addEventListener('scroll',(event) => {this.showFixedHeader(event.srcElement.scrollTop);});
    this.apiConfig.setPortal(portal);
    this.multiLingual.setLanguage(window.navigator.language.split('-')[0]);
    this.uiConfig.initialize(this.apiConfig.getPortal()).subscribe();
    this.state = 'Home';
    this.router.changes.subscribe(() => {
      this.searchBarIsActive = this.checkRouteForSearchBar(this.location.path());
      this.state = this.location.path();
    });
    this.uiConfig.get('header').subscribe((data) => this.header = data.config);
    this.uiConfig.get('searchBox').subscribe(data => this.searchBox = data.config);
    this.currentUser.set();
  }

  public logout(): void {
    this.authentication.destroy().subscribe();
    this.currentUser.destroy();
    this.router.navigate(['/']);
  }

  public changeLang(data: any): void { this.multiLingual.setLanguage(data.lang); }

  public closeBinTray(): void {
    this.binTrayIsOpen = false;
  }

  public closeSearch(): void {
    this.searchIsOpen = false;
  }
  public openBinTray(): void {
    this.binTrayIsOpen = true;
  }

  public openSearch(): void {
    this.searchIsOpen = true;
  }

  public showFixedHeader(offset: any): void {
    console.log(offset);
    let isfixed: boolean = this.showFixed;
    let setFixed: boolean = (offset > 111) ? true : false;
    if (setFixed !== isfixed) this.showFixed = !this.showFixed;
  }

  public checkRouteForSearchBar(currentState: string): boolean {
    if (currentState === '') return false;
    return ['user', 'admin']
      .filter((state) => currentState.indexOf(state) > -1).length === 0;
  }

  public newSearchContext(data: any): void { this.searchContext.new({ q: data, i: 1 }); }
}
