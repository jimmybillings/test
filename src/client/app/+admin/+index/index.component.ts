import {Component, OnInit, OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, RouteSegment} from '@angular/router';
import {CurrentUser} from '../../shared/services/current-user.model';
import {AdminService} from '../services/admin.service';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {WzListComponent} from '../../shared/components/wz-list/wz.list.component';
import {WzFormComponent} from '../../shared/components/wz-form/wz.form.component';
import {PaginationComponent} from '../../shared/components/pagination/pagination.component';
import {UiConfig} from '../../shared/services/ui.config';
import {IuiConfig} from '../../shared/interfaces/config.interface';
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
  public currentUserResources: Object;
  public config: IuiConfig;

  constructor(public currentUser: CurrentUser,
    public adminService: AdminService,
    public routeSegment: RouteSegment,
    public uiConfig: UiConfig,
    public router: Router) { }

  ngOnInit(): void {
    this.resource = this.getResourceFromUrl();
    this.currentComponent = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
    this.uiConfig.get('admin' + this.currentComponent).subscribe((config) => {
      this.config = config.config;
      this.getIndex();
    });
    this.subscription = this.adminService.adminStore.subscribe(data => this.currentUserResources = data);
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public getIndex(): void {
    let params = this.adminService.buildRouteParams();
    this.toggleFlag = params.d;
    this.adminService.getResources(params, this.resource).subscribe(data => {
      this.adminService.setResources(data);
    });
  }

  public navigateToPageUrl(i: number): void {
    let params = this.adminService.buildRouteParams({ i });
    this.router.navigate(['/admin/resource/' + this.resource, params]);
  }

  public navigateToSortUrl(sortParams: any): void {
    let params = this.adminService.buildRouteParams(sortParams);
    this.router.navigate(['/admin/resource/' + this.resource, params]);
  }

  public navigateToFilterUrl(filterParams: any): void {
    let searchTerms = this.adminService.buildSearchTerm(filterParams);
    let params = this.adminService.buildRouteParams(searchTerms);
    params.i = 1;
    this.router.navigate(['/admin/resource/' + this.resource, params]);
  }

  public navigateToBaseUrl(): void {
    this.router.navigate(['/admin/resource/' + this.resource]);
  }

  private getResourceFromUrl(): string {
    return this.routeSegment.getParam('resource');
  }
}
