import {
  UiComponentsA,
  AdminUrlParams,
  AdminFormParams
} from '../../shared/interfaces/admin.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { AdminService } from '../services/admin.service';
import { FormFields } from '../../shared/interfaces/forms.interface';
import { User } from '../../shared/interfaces/user.interface';
import { Account } from '../../shared/interfaces/admin.interface';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { Subscription } from 'rxjs/Rx';


@Component({
  moduleId: module.id,
  selector: 'admin-index',
  templateUrl: 'index.html',
})

export class IndexComponent implements OnInit, OnDestroy {
  public params: AdminUrlParams;
  public toggleFlag: string;
  public resourceType: string;
  public currentComponent: string;
  public formItems: Array<FormFields>;
  public config: any;
  public resource: User | Account;
  private routeSubscription: Subscription;

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
    this.routeSubscription.unsubscribe();
  }

  public routeChanges(): Subscription {
    return this.route.params.subscribe(params => {
      this.toggleFlag = params['d'];
      this.buildRouteParams(params);
      this.resourceType = this.route.snapshot.url[1].path;
      this.currentComponent = this.resourceType.charAt(0).toUpperCase() + this.resourceType.slice(1);
      this.uiConfig.get('admin' + this.currentComponent)
        .take(1).subscribe((config: UiComponentsA) => {
          this.config = config.config;
        });
    });
  }

  public getIndex(): void {
    this.adminService.getResourceIndex(this.params, this.resourceType);
  }

  public navigateToPageUrl(i: string): void {
    this.updateRouteParams({ i });
    this.router.navigate(['/admin/resource/' + this.resourceType, this.params]);
  }

  public navigateToSortUrl(sortParams: AdminUrlParams): void {
    let params = Object.assign(this.updateRouteParams(sortParams), { 'i': 1 });
    this.router.navigate(['/admin/resource/' + this.resourceType, params]);
  }

  public navigateToFilterUrl(filterParams: AdminFormParams): void {
    let searchTerms = this.adminService.buildSearchParameters(filterParams);
    let params = Object.assign(this.updateRouteParams(searchTerms), { 'i': 1 });
    this.router.navigate(['/admin/resource/' + this.resourceType, params]);
  }

  public mergeFormValues(resource: User | Account): void {
    this.resource = resource;
    this.formItems = this.config.editForm.items.map((field: FormFields) => {
      field.value = resource[field.name];
      return field;
    });
  }

  public onEditSubmit(data: User | Account): void {
    Object.assign(this.resource, data);
    this.adminService.putResource(this.resourceType, this.resource).take(1).subscribe(data => {
      this.getIndex();
    });
  }

  public onNewSubmit(data: User | Account): void {
    this.adminService.postResource(this.resourceType, data).take(1).subscribe(data => {
      this.getIndex();
    });
  }

  public buildRouteParams(params: AdminUrlParams): void {
    let s: string, d: string, i: string, n: string, fields: string, values: string;
    s = params['s'] || 'createdOn';
    d = params['d'];
    i = params['i'] || '1';
    n = params['n'] || '10';
    // Hack because browser makes empty values 'true' in the url
    fields = (params['fields'] === 'true') ? '' : params['fields'];
    values = (params['values'] === 'true') ? '' : params['values'];
    this.params = { i, n, s, d, fields, values };
  }
  
  private updateRouteParams(dynamicParams: AdminUrlParams) {
    return Object.assign(this.params, dynamicParams);
  }
}
