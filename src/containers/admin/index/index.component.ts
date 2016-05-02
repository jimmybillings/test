import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {AdminService} from '../services/admin.service';
import {WzList} from '../../../components/wz-list/wz.list.component';
import {Pagination} from '../../../components/pagination/pagination.component';
import {ROUTER_DIRECTIVES, Router, CanReuse, ComponentInstruction, RouteParams} from 'angular2/router';
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
export class Index implements CanReuse {
  public currentUser: CurrentUser;
  public adminService: AdminService;
  public routeParams: RouteParams;
  public resource: string;
  public currentUserResources: Object;
  public pageSize: any;
  public components: Object;
  public headers: Array<string>;
  public subscription: any;
  public toggleFlag: string;
  
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
    let searchQueryString = this.getRouteParams();
    this.toggleFlag = searchQueryString.d;
    this.adminService.getResources(this.resource, searchQueryString.i, this.pageSize.value, searchQueryString.s, searchQueryString.d).subscribe(data => {
      this.adminService.setResources(data); 
    });
  }
  
  public navigateToPageUrl(pageNum: number): void  {
    let searchQueryString = this.getRouteParams();
    let component = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
    this.router.navigate(['/Admin/' + component, { i: pageNum, n: this.pageSize.value, s: searchQueryString.s, d: searchQueryString.d }]);
  }
  
  public navigateToSortUrl(args: any): void  {
    let component = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
    this.router.navigate(['/Admin/' + component, { i: 1, n: this.pageSize.value, s: args.attr, d: args.toggle }]);
  }
  
  public getRouteParams(): any {
    let sortAttr = this.routeParams.get('s') || 'createdOn';
    let sortOrder = (this.routeParams.get('d') ? true : false);
    let pageNum = parseInt(this.routeParams.get('i')) || 1;
    let perPage = parseInt(this.routeParams.get('n')) || this.pageSize.value;
    return { 'i': pageNum, 'n': perPage, 's': sortAttr, 'd': sortOrder };
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
