import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {AdminService} from '../services/admin.service';
import {WzList} from '../../../components/wz-list/wz.list.component';
import {Observable} from 'rxjs/Observable';
import {Pagination} from '../../../components/pagination/pagination';
import {Location} from 'angular2/router';

@Component({
  selector: 'admin-index',
  templateUrl: 'containers/admin/index/index.html',
  providers: [AdminService],
  directives: [WzList, Pagination]
})

/**
 * Admin List Component - Creates a component that generates lists. It is instantiated with the current user
 */
export class Index {
  public currentUser: CurrentUser;
  public adminService: AdminService;
  public resource: string;
  public currentUserResource: Observable<any>;
  public currentPageNumber: Observable<any>;
   
  constructor(currentUser: CurrentUser, adminService: AdminService, location: Location) {
    this.currentUser = currentUser;
    this.adminService = adminService;
    this.resource = this.getResource();
    
  }
  
  ngOnInit(): void {
    this.index();
    this.adminService.admin.subscribe(data => this.currentUserResource = data.resource);
    this.adminService.admin.subscribe(data => this.currentPageNumber = data.currentPage);
  }
  
  public index(): void {
    this.adminService.getResourceForUser(this.resource, 0).subscribe(data => {
      this.adminService.setResource(data); 
    });
  }
  
  public getNextPage(pageNum:any): void  {
    this.adminService.getResourceForUser(this.resource, pageNum).subscribe(data => {
      this.adminService.setResource(data); 
    });
  }
  
  public getPrevPage(pageNum:any): void  {
    this.adminService.getResourceForUser(this.resource, pageNum).subscribe(data => {
      this.adminService.setResource(data); 
    });
  }
  
  public getResource() {
    switch (location.hash.split('#/admin/')[1]) {
      case 'users':
        return this.resource = 'user';
      default:
        return this.resource = 'account';
    }
  }
}
