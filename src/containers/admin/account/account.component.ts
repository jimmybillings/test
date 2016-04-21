import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {AccountService} from '../services/account.service';
import {WzList} from '../../../components/wz-list/wz.list.component';
import {Observable} from 'rxjs/Observable';
import {Pagination} from '../../../components/pagination/pagination';

@Component({
  selector: 'admin-accounts',
  templateUrl: 'containers/admin/account/account.html',
  providers: [AccountService],
  directives: [WzList, Pagination]
})

/**
 * Account Component - Creates an admin account. It is instantiated with the current user
 */
export class Account {
  public currentUser: CurrentUser;
  public accountService: AccountService;
  public currentUserAccounts: Observable<any>;
  public currentPageNumber: Observable<any>;
   
  constructor(currentUser: CurrentUser, accountService: AccountService) {
    this.currentUser = currentUser;
    this.accountService = accountService;
  }
  
  ngOnInit(): void {
    this.accountService.getAccountsForUser(this.currentUser, 0);
    this.accountService.admin.subscribe(data => this.currentUserAccounts = data.accounts);
    this.accountService.admin.subscribe(data => this.currentPageNumber = data.currentPage);
  }
  
  public getNextPage(pageNum:any): void  {
    this.accountService.getAccountsForUser(this.currentUser, pageNum);
  }
  
  public getPrevPage(pageNum:any): void  {
    this.accountService.getAccountsForUser(this.currentUser, pageNum);
  }
}
