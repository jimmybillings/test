import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Authentication} from '../../../common/services/authentication.data.service';
import {CurrentUser} from '../../../common/models/current-user.model';

/**
 * Logout component - handles removal of current user and destroying valid token on the server.
 */ 
@Component({
  selector: 'logout',
  templateUrl: 'components/user-management/logout/logout.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [Authentication]
})

export class Logout {
  constructor(
    private _authentication: Authentication,
    public router: Router, 
    private _currentUser: CurrentUser) {
  }
  
  /**
   * remove current user by invalidating token on the server, 
   * clearing localStorage user information, resetting current user object with null values,
   * and finally redirecting url to the home page.
   */  
  public onSubmit(): void {
    this._authentication.destroy().subscribe();
    localStorage.clear();
    this._currentUser.set();
    this.router.navigate(['/Home']);
  }
}
