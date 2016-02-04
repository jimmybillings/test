import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Header} from './header/header.component';
import {Footer} from './footer/footer.component';
import {UserManagement} from '../user-management/user-management.component';
import {Home} from '../home/home.component';
import {Search} from '../search/search.component';
import {CurrentUser} from '../../common/models/current-user.model';

@Component({
  selector: 'app',
  templateUrl: 'components/application/app.html',
  directives: [ROUTER_DIRECTIVES, Header, Footer]
})

@RouteConfig([
  { path: '/',  name: 'Home', component: Home, useAsDefault: true},
  { path: '/user/...', component: UserManagement, name: 'UserManagement'},
  { path: '/search', component: Search, name: 'Search'},
])

export class AppComponent {
    public currentUser: CurrentUser;
    constructor(currentUser: CurrentUser) {
      this.currentUser = currentUser;
    }

    ngOnInit() {
      this.currentUser.set();
    }  
}
