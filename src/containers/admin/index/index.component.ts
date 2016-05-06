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
  public operatorMap: Object;
  public currentUserResources: Object;
  public components: Object;
  public headers: Array<string>;
  public fields: Array<string>;
  
  constructor(currentUser: CurrentUser,
              adminService: AdminService,
              routeParams: RouteParams,
              public uiConfig: UiConfig,
              public router: Router) {
    this.currentUser = currentUser;
    this.adminService = adminService;
    this.routeParams = routeParams;
    this.operatorMap = {
      'before': 'LT',
      'after': 'GT'
    };
  }
  
  routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return false; }
  
  ngOnInit(): void {
    this.resource = this._getResourceFromUrl();
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
    let params = this._buildRouteParams();
    this.toggleFlag = params.d;
    this.adminService.getResources(params, this.resource).subscribe(data => {
      this.adminService.setResources(data); 
    });
  }
  
  public navigateToPageUrl(i: number): void  {
    let params = this._buildRouteParams();
    let urlParameters = { i, n: params.n, s: params.s, d: params.d, q: params.q };
    this.router.navigate(['/Admin/' + this.currentComponent, urlParameters ]);
  }
  
  public navigateToSortUrl(sortParams: any): void  {
    let params = this._buildRouteParams();
    let urlParameters = { i: 1, n: params.n, s: sortParams.attr, d: sortParams.toggle, q: params.q };
    this.router.navigate(['/Admin/' + this.currentComponent, urlParameters ]);
  }
  
  public navigateToFilterUrl(filterParams: any): void {
    let params = this._buildRouteParams();
    let searchTerms = this._buildSearchTerm(filterParams);
    params.q = searchTerms;
    this.router.navigate(['/Admin/' + this.currentComponent, params ]);
  }
  
  public navigateToBaseUrl(event): void {
    this.router.navigate(['/Admin/' + this.currentComponent]);
  }

  private _buildRouteParams(): any {
    let s = this.routeParams.get('s') || 'createdOn';
    let d = (this.routeParams.get('d') ? true : false);
    let i = parseInt(this.routeParams.get('i')) || 1;
    let n = parseInt(this.routeParams.get('n')) || this.pageSize.value;
    let q = this.routeParams.get('q') || '';
    return { i, n, s, d, q };
  }
  
  /**
   * Uses the location of the url to pick out the resource to be passed through to the service
   * Eventually, this will have to change when there are more resources
   */
  private _getResourceFromUrl() {
    let path = window.location.pathname;
    return path.indexOf('users') > -1 ? 'user' : 'account';
  }
  
  private _buildSearchTerm(filterParams: any): string {
    let params = this._removeEmptyParams(filterParams);
    let rawFields = this._buildFields(params);
    let rawValues = this._buildValues(params);
    let processedFields = rawFields.reduce(this.removeFields,[]).join(',');
    let processedValues = rawValues.reduce(this.removeFields,[]).join(',');
    return `fields=${processedFields}&values=${processedValues}`;
  }
  
  private _removeEmptyParams(params: any): any {
    for (var param in params) {
      if (params[param] === '') {
        delete params[param];
      }
    }
    return params;
  }
  
  private _buildValues(filterParams: any): Array<string> {
    return Object.keys(filterParams).reduce((prev, current) => {
      if (current === 'createdOn' || current === 'lastUpdated') {
        let date = new Date(filterParams[current]);
        prev.push(encodeURI((date.getTime()/1000).toString()));
      } else {
        prev.push(encodeURI(filterParams[current])); 
      }
      return prev;
    }, []);
  }
  
  private _buildFields(filterParams: any): Array<string> {
    let fields = Object.keys(filterParams);
    return fields.reduce((prev, current) => {
      if (current === 'DATE') {
        prev.push(current + ':' + this.operatorMap[filterParams[current]] + ':');
      } else {
        prev.push(current);
      }
      return prev;
    }, []);
  }
  
  private removeFields(prev, field, index): Array<string> {
    let fieldsToRemove = ['createdOn', 'lastUpdated', 'before', 'after'];
    if (fieldsToRemove.indexOf(field) > -1) {
      prev.push(field);
      return prev.slice(0, index);
    } else {
      prev.push(encodeURI(field));
      return prev;
    }
  }
}
