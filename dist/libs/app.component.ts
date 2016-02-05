import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Header} from './components/layout/header/header.component';
import {Footer} from './components/layout/footer/footer.component';
import {UserManagement} from './components/user-management/user-management.component';
import {Home} from './components/home/home.component';
import {Search} from './components/search/search.component';
import {CurrentUser} from './common/models/current-user.model';
import {ApiConfig} from './common/config/api.config';

@Component({
  selector: 'app',
  templateUrl: './app.html',
  directives: [ROUTER_DIRECTIVES, Header, Footer]
})

@RouteConfig([
  { path: '/',  name: 'Home', component: Home, useAsDefault: true},
  { path: '/user/...', component: UserManagement, name: 'UserManagement'},
  { path: '/search', component: Search, name: 'Search'},
])

export class AppComponent {
  
    constructor(
      public currentUser: CurrentUser, 
      private _apiConfig: ApiConfig) {
      this._apiConfig.setPortal('cnn');
    }

    ngOnInit() {
      this.currentUser.set();
    }  
}
