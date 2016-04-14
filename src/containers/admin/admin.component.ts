import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CurrentUser} from '../../common/models/current-user.model';
import {Dashboard} from './dashboard/dashboard.component';
import {Account} from './account/account.component';

@Component({
  selector: 'admin',
  template: '<router-outlet></router-outlet>',
  directives: ROUTER_DIRECTIVES
})

@RouteConfig([
  { path: '/dashboard', component: Dashboard, name: 'Dashboard' },
  { path: '/accounts', component: Account, name: 'Account' }
])

export class Admin implements OnInit {
  public currentUser: CurrentUser;
  
  constructor(currentUser: CurrentUser, private _router: Router) {
    this.currentUser = currentUser;
  }
  
  ngOnInit() {
    this.authorization();
  }
  
  authorization(): void {
    if (!this.currentUser.isAdmin()) {
      this._router.navigate(['/Home']);
    };
  } 
}
