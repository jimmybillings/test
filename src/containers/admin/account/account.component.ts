import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {AccountService} from '../services/account.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'admin-accounts',
  templateUrl: 'containers/admin/account/account.html',
  providers: [AccountService]
})

/**
 * Account Component - Creates an admin account. It is instantiated with the current user
 */
export class Account {
  public currentUser: CurrentUser;
  public accountService: AccountService;
  private _currentUserAccounts: Observable<any>;
   
  constructor(currentUser: CurrentUser, accountService: AccountService) {
    this.currentUser = currentUser;
    this.accountService = accountService;
    this._currentUserAccounts = this.accountService.currentUserAccounts;
  }
  
  ngOnInit(): void {
    this.getAccounts();
  }
  
  getAccounts(): void {
    this.accountService.getAccountsForUser(this.currentUser);
  }
}
