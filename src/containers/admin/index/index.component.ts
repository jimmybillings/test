import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {AdminService} from '../services/admin.service';
import {WzList} from '../../../components/wz-list/wz.list.component';
import {Pagination} from '../../../components/pagination/pagination';
import {ROUTER_DIRECTIVES, Location, Router} from 'angular2/router';
import {UiConfig} from '../../../common/config/ui.config';

@Component({
  selector: 'admin-index',
  templateUrl: 'containers/admin/index/index.html',
  providers: [AdminService],
  directives: [WzList, Pagination, ROUTER_DIRECTIVES]
})

/**
 * Admin Index Component - Creates a component that generates lists. It is instantiated with the current user
 */
export class Index {
  public currentUser: CurrentUser;
  public adminService: AdminService;
  public resource: string;
  public currentUserResources: Object;
  public config: Object;
  public components: Object;
  public headers: Array<string>;
  
  constructor(currentUser: CurrentUser,
              adminService: AdminService,
              public uiConfig: UiConfig,
              public location: Location,
              public router: Router) {
    this.currentUser = currentUser;
    this.adminService = adminService;
  }
  
  ngOnInit(): void {
    this.resource = this.getResource();
    this.uiConfig.get('admin').subscribe((config) => {
      this.components = config.components;
      this.config = config.config;
      this.headers = config.config[this.resource].items;
    });
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
  
  public getSortedCollection(args: any): void {
    this.adminService.getSortedResources(this.resource, args.attr, args.toggle).subscribe(data => {
      this.adminService.setResource(data); 
    });
  }
  
  public getResource() {
    switch (location.hash.split('admin/')[1]) {
      case 'users':
        return 'user';
      case 'accounts':
        return 'account';
    }
  }
}
