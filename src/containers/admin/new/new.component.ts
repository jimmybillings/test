import { Component } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
import { WzForm } from '../../../components/wz-form/wz.form.component';
import { UiConfig } from '../../../common/config/ui.config';
import { ApiConfig } from '../../../common/config/api.config';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'admin-new',
  templateUrl: 'containers/admin/new/new.html',
  providers: [AdminService],
  directives: [WzForm]
})

export class New {
  public resource: string;
  public siteName: string;
  public currentComponent: string;
  public config: any;

  constructor(public router: Router,
              public apiConfig: ApiConfig,
              public adminService: AdminService,
              public routeParams: RouteParams,
              public uiConfig: UiConfig) {}

  ngOnInit(): void {
    this.siteName = this.apiConfig.getPortal();
    this.resource = this.routeParams.get('resource');
    this.currentComponent = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
    this.uiConfig.get('admin' + this.currentComponent).subscribe((config) => {
      this.config = config.config;
    });
  }

  public onSubmit(formData: any): void {
    Object.assign(formData, {siteName: this.siteName});
    this.adminService.postResource(formData, this.resource).subscribe(data => {
      console.log(data);
      this.router.navigate(['/Admin/' + this.currentComponent]);
    },(error) => {
      console.log(error, 'this will pop up a notification showing what validations failed');
    });
  }
}
