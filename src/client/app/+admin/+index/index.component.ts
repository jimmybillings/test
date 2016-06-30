import {Component, OnInit, OnDestroy} from '@angular/core';
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
  private sub: any;

  constructor(public currentUser: CurrentUser,
    public adminService: AdminService,
    public route: ActivatedRoute,
    public uiConfig: UiConfig,
    public uiState: UiState,
    public router: Router) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(param => {
      this.params = this.buildRouteParams(param);
      this.resource = param['resource'];
      this.currentComponent = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
      this.buildRouteParams(param);
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
    let params = this.updateRouteParams({ i });
    this.router.navigate(['/admin/resource/' + this.resource, params]);
  }

  public navigateToSortUrl(sortParams: any): void {
    let params = this.updateRouteParams(sortParams);
    this.router.navigate(['/admin/resource/' + this.resource, params]);
  }

  public navigateToFilterUrl(filterParams: any): void {
    let searchTerms = this.adminService.buildSearchTerm(filterParams);
    let params = this.updateRouteParams(searchTerms);
    params.i = 1;
    this.router.navigate(['/admin/resource/' + this.resource, params]);
  }

  public showEditForm(resource: any): void {
    this.adminService.showEditComponent(this.config.editForm.items, resource, this.resource);
  }

  public showNewForm(): void {
    this.adminService.showNewComponent(this.config.newForm.items, this.resource);
  }

  public updateRouteParams(dynamicParams?: any) {
    return dynamicParams ? Object.assign(this.params, dynamicParams) : this.params;
  }

  public buildRouteParams(params: any): any {
    let s: string, d: boolean, i: number, n: number, fields: string, values: string;
    s = params['s'] || 'createdOn';
    d = (params['d'] ? true : false);
    i = parseInt(params['i']) || 1;
    n = parseInt(params['n']) || 10;
    fields = params['fields'] || '';
    values = params['values'] || '';
    this.params = { i, n, s, d, fields, values };
  }
}
