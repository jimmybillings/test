import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {AdminService} from '../services/admin.service';
import {WzList} from '../../../components/wz-list/wz.list.component';
import {Pagination} from '../../../components/pagination/pagination';
import {Location} from 'angular2/router';

@Component({
  selector: 'admin-index',
  templateUrl: 'containers/admin/index/index.html',
  providers: [AdminService],
  directives: [WzList, Pagination]
})

/**
 * Admin Index Component - Creates a component that generates lists. It is instantiated with the current user
 */
export class Index {
  public currentUser: CurrentUser;
  public adminService: AdminService;
  public resource: string;
  public currentUserResources: Object;
   
  constructor(currentUser: CurrentUser, adminService: AdminService, location: Location) {
    this.currentUser = currentUser;
    this.adminService = adminService;
    this.resource = this.getResource();
  }
  
  ngOnInit(): void {
    this.getIndex();
    this.adminService.adminStore.subscribe(data => this.currentUserResources = data);
  }
  
  public getIndex(): void {
    this.adminService.getResource(this.resource, 0).subscribe(data => {
      this.adminService.setResource(data); 
    });
  }
  
  public getPageNumber(pageNum: any): void  {
    this.adminService.getResource(this.resource, pageNum).subscribe(data => {
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
