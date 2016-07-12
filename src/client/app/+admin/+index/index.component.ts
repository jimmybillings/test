import {Component, OnInit, OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {CurrentUser} from '../../shared/services/current-user.model';
import {AdminService} from '../services/admin.service';
import {WzListComponent} from '../../shared/components/wz-list/wz.list.component';
import {WzFormComponent} from '../../shared/components/wz-form/wz.form.component';
import {WzPaginationComponent} from '../../shared/components/wz-pagination/wz.pagination.component';
import {UiConfig} from '../../shared/services/ui.config';
import {UiState} from '../../shared/services/ui.state';
import {Subscription} from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'admin-index',
  templateUrl: 'index.html',
  directives: [WzListComponent, WzPaginationComponent, ROUTER_DIRECTIVES, WzFormComponent]
})

export class IndexComponent implements OnInit, OnDestroy {
  public toggleFlag: any;
  public resourceType: string;
  public currentComponent: string;
  public currentResources: Object;
  public config: any;
  public params: any;
  private routeSubscription: Subscription;
  private adminStoreSubscription: Subscription;

  constructor(public currentUser: CurrentUser,
    public adminService: AdminService,
    public route: ActivatedRoute,
    public uiConfig: UiConfig,
    public uiState: UiState,
    public router: Router) { }

  ngOnInit(): void {
    this.routeSubscription = this.routeChanges();
  }

  ngOnDestroy(): void {
    this.adminStoreSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  routeChanges(): Subscription {
    return this.route.params.subscribe(param => {
      this.adminStoreSubscription = this.adminService.adminStore.subscribe(data => this.currentResources = data);
      this.resourceType = this.route.snapshot.url[1].path;
      this.currentComponent = this.resourceType.charAt(0).toUpperCase() + this.resourceType.slice(1);
      this.buildRouteParams(param);
      this.uiConfig.get('admin' + this.currentComponent)
        .first().subscribe((config) => {
          this.config = config.config;
          this.getIndex();
        });
    });
  }

  public getIndex(): void {
    this.toggleFlag = this.params.d;
    this.adminService.getResources(this.params, this.resourceType).first().subscribe(data => {
      this.adminService.setResources(data);
    });
  }

  public navigateToPageUrl(i: number): void {
    this.updateRouteParams({ i });
    this.router.navigate(['/admin/resource/' + this.resourceType, this.params]);
  }

  public navigateToSortUrl(sortParams: any): void {
    let params = Object.assign(this.updateRouteParams(sortParams), { 'i': 1 });
    this.router.navigate(['/admin/resource/' + this.resourceType, params]);
  }

  public navigateToFilterUrl(filterParams: any): void {
    let searchTerms = this.adminService.buildSearchTerm(filterParams);
    let params = Object.assign(this.updateRouteParams(searchTerms), { 'i': 1 });
    this.router.navigate(['/admin/resource/' + this.resourceType, params]);
  }

  public updateRouteParams(dynamicParams: any) {
    return Object.assign(this.params, dynamicParams);
  }

  public buildRouteParams(params: any): any {
    let s: string, d: boolean, i: number, n: number, fields: string, values: string;
    s = params['s'] || 'createdOn';
    d = params['d'];
    i = parseInt(params['i']) || 1;
    n = parseInt(params['n']) || 10;
    // Hack because browser makes empty values 'true' in the url
    fields = (Boolean(params['fields'])) ? '' : params['fields'];
    values = (Boolean(params['values'])) ? '' : params['values'];
    this.params = { i, n, s, d, fields, values };
  }

  public showEditForm(resource: any): void {
    this.adminService.showEditComponent(this.config.editForm.items, resource, this.resourceType);
  }

  public showNewForm(): void {
    this.adminService.showNewComponent(this.config.newForm.items, this.resourceType);
  }
}
