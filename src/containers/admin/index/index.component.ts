import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {AdminService} from '../services/admin.service';
import {WzList} from '../../../components/wz-list/wz.list.component';
import {Filter} from '../../../components/filter/filter.component';
import {Pagination} from '../../../components/pagination/pagination.component';
import {ROUTER_DIRECTIVES, Router, CanReuse, ComponentInstruction, RouteParams} from 'angular2/router';
import {UiConfig} from '../../../common/config/ui.config';
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'admin-index',
  templateUrl: 'containers/admin/index/index.html',
  providers: [AdminService],
  directives: [WzList, Pagination, ROUTER_DIRECTIVES, Filter]
})

export class Index implements CanReuse {
  public resource: string;
  public toggleFlag: string;
  public currentComponent: string;
  public pageSize: {value: string};
  public subscription: Subscription;
  public currentUserResources: Object;
  public components: Object;
  public headers: Array<string>;
  public fields: Array<string>;
  
  constructor(public currentUser: CurrentUser,
              public adminService: AdminService,
              public routeParams: RouteParams, 
              public uiConfig: UiConfig,
              public router: Router) {}
  
  routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return false; }
  
  ngOnInit(): void {    
    this.resource = this.getResourceFromUrl();
    this.currentComponent = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
    this.uiConfig.get('admin').subscribe((config) => {
      this.components = config.components;
      this.pageSize = config.config.pagination.config.pageSize;
      this.headers = config.config[this.resource].items;
      this.fields = config.config[this.resource].config.form.items;
    });
    this.subscription = this.adminService.adminStore.subscribe(data => this.currentUserResources = data);
    this.getIndex();
  }
  
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  
  public getIndex(): void {
    let params = this.adminService.buildRouteParams(this.pageSize.value);
    this.toggleFlag = params.d;
    this.adminService.getResources(params, this.resource).subscribe(data => {
      this.adminService.setResources(data); 
    });
  }
  
  public navigateToPageUrl(i: number): void  {
    let params = this.adminService.buildRouteParams(this.pageSize.value, {i});
    this.router.navigate(['/Admin/' + this.currentComponent, params ]);
  }
  
  public navigateToSortUrl(sortParams: any): void  {
    let params = this.adminService.buildRouteParams(this.pageSize.value, sortParams);
    this.router.navigate(['/Admin/' + this.currentComponent, params ]);
  }
  
  public navigateToFilterUrl(filterParams: any): void {
    let searchTerms = this.adminService.buildSearchTerm(filterParams);
    let params = this.adminService.buildRouteParams(this.pageSize.value, searchTerms);
    this.router.navigate(['/Admin/' + this.currentComponent, params ]);
  }
  
  public navigateToBaseUrl(event): void {
    this.router.navigate(['/Admin/' + this.currentComponent]);
  }
 
  private getResourceFromUrl(): string {
    return this.router.parent.currentInstruction.component.routeName.toLowerCase();
  }
}
