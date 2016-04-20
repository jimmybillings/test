import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';

@Component({
  selector: 'admin-accounts',
  templateUrl: 'containers/admin/account/account.html'
})

/**
 * Account Component - Creates an admin account. It is instantiated with the current user
 */
export class Account {
  public currentUser: CurrentUser;
  
  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
}
