import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {AccountService} from '../services/account.service';
import {WzList} from '../../../components/wz-list/wz.list.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'admin-accounts',
  templateUrl: 'containers/admin/account/account.html',
  providers: [AccountService],
  directives: [WzList]
})

/**
 * Account Component - Creates an admin account. It is instantiated with the current user
 */
export class Account {
  public currentUser: CurrentUser;
  public accountService: AccountService;
  public currentUserAccounts: Observable<any>;
   
  constructor(currentUser: CurrentUser, accountService: AccountService) {
    this.currentUser = currentUser;
    this.accountService = accountService;
  }
  
  ngOnInit(): void {
    this.accountService.getAccountsForUser(this.currentUser);
    this.currentUserAccounts = this.accountService.currentUserAccounts;
  }
}
