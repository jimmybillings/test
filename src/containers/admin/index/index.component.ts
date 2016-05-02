import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {AdminService} from '../services/admin.service';
import {WzList} from '../../../components/wz-list/wz.list.component';
import {Filter} from '../../../components/filter/filter.component';
import {Pagination} from '../../../components/pagination/pagination.component';
import {ROUTER_DIRECTIVES, Router, CanReuse, ComponentInstruction, RouteParams} from 'angular2/router';
import {UiConfig} from '../../../common/config/ui.config';

@Component({
  selector: 'admin-index',
  templateUrl: 'containers/admin/index/index.html',
  providers: [AdminService],
  directives: [WzList, Pagination, ROUTER_DIRECTIVES, Filter]
})

/**
 * Admin Index Component - Creates a component that generates lists. It is instantiated with the current user
 */
export class Index implements CanReuse {
  public currentUser: CurrentUser;
  public adminService: AdminService;
  public routeParams: RouteParams;
  public resource: string;
  public toggleFlag: string;
  public currentComponent: string;
  public pageSize: any;
  public subscription: any;
  public currentUserResources: Object;
  public components: Object;
  public headers: Array<string>;
  
  constructor(currentUser: CurrentUser,
              adminService: AdminService,
              routeParams: RouteParams,
              public uiConfig: UiConfig,
              public router: Router) {
    this.currentUser = currentUser;
    this.adminService = adminService;
    this.routeParams = routeParams;
  }
  
  routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return false; }
  
  ngOnInit(): void {
    this.resource = this.getResourceFromUrl();
    this.currentComponent = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
    this.uiConfig.get('admin').subscribe((config) => {
      this.components = config.components;
      this.pageSize = config.config.pagination.config.pageSize;
      this.headers = config.config[this.resource].items;
    });
    this.subscription = this.adminService.adminStore.subscribe(data => this.currentUserResources = data);
    this.getIndex();
  }
  
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  
  public getIndex(): void {
    let queryObject = this.buildQueryObject();
    this.toggleFlag = queryObject.d;
    this.adminService.getResources(queryObject).subscribe(data => {
      this.adminService.setResources(data); 
    });
  }
  
  public navigateToPageUrl(i: number): void  {
    let queryObject = this.buildQueryObject();
    let urlParameters = { i, n: this.pageSize.value, s: queryObject.s, d: queryObject.d };
    this.router.navigate(['/Admin/' + this.currentComponent, urlParameters ]);
  }
  
  public navigateToSortUrl(args: any): void  {
    let urlParameters = { i: 1, n: this.pageSize.value, s: args.attr, d: args.toggle };
    this.router.navigate(['/Admin/' + this.currentComponent, urlParameters ]);
  }
  
  public navigateToFilterUrl(args: any): void {
    let queryObject = this.buildQueryObject();
    let urlParameters = { i: 1, n: this.pageSize.value, s: queryObject.s, d: queryObject.d, q: args[Object.keys(args)[0]] };
    this.router.navigate(['/Admin/' + this.currentComponent, urlParameters ]);
  }
  
  public buildQueryObject(): any {
    let resource = this.resource;
    let s = this.routeParams.get('s') || 'createdOn';
    let d = (this.routeParams.get('d') ? true : false);
    let i = parseInt(this.routeParams.get('i')) || 1;
    let n = parseInt(this.routeParams.get('n')) || this.pageSize.value;
    let q = this.routeParams.get('q') || '';
    return { resource, i, n, s, d, q };
  }
  
  /**
   * Uses the location of the url to pick out the resource to be passed through to the service
   * Eventually, this will have to change when there are more resources
   */
  public getResourceFromUrl() {
    let path = window.location.pathname;
    return path.indexOf('users') > -1 ? 'user' : 'account';
  }
}
