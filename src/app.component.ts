import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Header} from './components/header/header.component';
import {Footer} from './components/footer/footer.component';
import {UserManagement} from './containers/user-management/user-management.component';
import {Home} from './containers/home/home.component';
import {Search} from './containers/search/search.component';
import {CurrentUser} from './common/models/current-user.model';
import {Authentication} from './containers/user-management/services/authentication.data.service';
import {ApiConfig} from './common/config/api.config';
import {UiConfig} from './common/config/ui.config';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app',
  templateUrl: './app.html',
  directives: [ROUTER_DIRECTIVES, Header, Footer],
  providers: [Authentication]

})

@RouteConfig([
  { path: '/', name: 'Home', component: Home, useAsDefault: true },
  { path: '/user/...', component: UserManagement, name: 'UserManagement' },
  { path: '/search', component: Search, name: 'Search' },
])

export class AppComponent {
  public header: Observable<any>;
  public footer: Observable<any>;
  
  constructor(
    public currentUser: CurrentUser,
    private _apiConfig: ApiConfig,
    public uiConfig: UiConfig,
    private _authentication: Authentication,
    public router: Router, 
    private _currentUser: CurrentUser) {
    this._apiConfig.setPortal('core');
  }

  ngOnInit() {
    this.uiConfig.initialize(this._apiConfig.getPortal())
      .subscribe(() => {        
        this.header = this.uiConfig.get('header');
        this.footer = this.uiConfig.get('footer');
      });
    
    this.currentUser.set();
  }
  
  public logout(): void {
    this._authentication.destroy().subscribe();
    localStorage.clear();
    this._currentUser.set();
    this.router.navigate(['/Home']);
  }
}
