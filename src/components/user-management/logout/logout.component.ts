import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Authentication} from '../../../common/services/authentication.data.service';
import {CurrentUser} from '../../../common/models/current-user.model';

@Component({
  selector: 'logout',
  templateUrl: 'components/user-management/logout/logout.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [Authentication]
})

export class Logout {    
    private _authentication: Authentication;
    private _currentUser: CurrentUser;
  
  constructor(_authentication: Authentication, _currentUser: CurrentUser) {
     this._authentication = _authentication;
     this._currentUser = _currentUser;
  }
  
  public onSubmit(): void {
    localStorage.clear();
    this._currentUser.set();
    this._authentication.destroy().subscribe();
  }
}
