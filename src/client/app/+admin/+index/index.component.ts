import {Component, OnInit, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {CurrentUser} from '../../shared/services/current-user.model';
import {AdminService} from '../services/admin.service';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {WzListComponent} from '../../shared/components/wz-list/wz.list.component';
import {WzFormComponent} from '../../shared/components/wz-form/wz.form.component';
import {PaginationComponent} from '../../shared/components/pagination/pagination.component';
import {UiConfig} from '../../shared/services/ui.config';
import {UiState} from '../../shared/services/ui.state';
// import {IuiConfig} from '../../shared/interfaces/config.interface';
import {Subscription} from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'admin-index',
  templateUrl: 'index.html',
  providers: [AdminService],
  directives: [WzListComponent, PaginationComponent, ROUTER_DIRECTIVES, WzFormComponent],
  pipes: [TranslatePipe]
})

export class IndexComponent implements OnInit, OnDestroy {
  public resource: string;
  public toggleFlag: string;
  public currentComponent: string;
  public subscription: Subscription;
  public currentResources: Object;
  public config: any;
  public params: any;
  @ViewChild('target', { read: ViewContainerRef }) target: any;
  private sub: any;

  constructor(public currentUser: CurrentUser,
    public adminService: AdminService,
    public route: ActivatedRoute,
    public uiConfig: UiConfig,
    public uiState: UiState,
    public router: Router) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(param => {
      this.params = this.buildRouteParams(param);
      this.resource = param['resource'];
      this.currentComponent = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
      this.uiConfig.get('admin' + this.currentComponent).subscribe((config) => {
        this.config = config.config;
        this.getIndex(this.params);
        this.adminService.adminStore.subscribe(data => {
          this.currentResources = data;
        });
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    this.sub.unsubscribe();
  }

  public getIndex(params: any): void {
    this.toggleFlag = params.d;
    this.adminService.getResources(params, this.resource).subscribe(data => {
      this.adminService.setResources(data);
    });
  }

  public navigateToPageUrl(i: number): void {
    let params = this.buildRouteParams({ i });
    this.router.navigate(['/admin/resource/' + this.resource, params]);
  }

  public navigateToSortUrl(sortParams: any): void {
    let params = this.buildRouteParams(sortParams);
    this.router.navigate(['/admin/resource/' + this.resource, params]);
  }

  public navigateToFilterUrl(filterParams: any): void {
    let searchTerms = this.adminService.buildSearchTerm(filterParams);
    let params = this.buildRouteParams(searchTerms);
    params.i = 1;
    this.router.navigate(['/admin/resource/' + this.resource, params]);
  }

  public showEditForm(resource: any): void {
    console.log(resource);
    this.adminService.showEditComponent(this.target, this.config.editForm.items, resource);
  }

  public buildRouteParams(param: any, dynamicParams?: any): any {
    let s:string = param['s'] || 'createdOn';
    let d:boolean = (param['d'] ? true : false);
    let i:number = parseInt(param['i']) || 1;
    let n:number = parseInt(param['n']) || 10;
    let fields:string = param['fields'] || '';
    let values:string = param['values'] || '';
    let params = { i, n, s, d, fields, values };
    return dynamicParams ? Object.assign(params, dynamicParams) : params;
  }
}
