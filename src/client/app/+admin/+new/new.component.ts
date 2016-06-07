import { Component, OnInit } from '@angular/core';
import { Router, RouteSegment } from '@angular/router';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';
import { UiConfig } from '../../shared/services/ui.config';
import { IuiConfig } from '../../shared/interfaces/config.interface';
import { ApiConfig } from '../../shared/services/api.config';
import { AdminService } from '../services/admin.service';

@Component({
  moduleId: module.id,
  selector: 'admin-new',
  templateUrl: 'new.html',
  providers: [AdminService],
  directives: [WzFormComponent],
  pipes: [TranslatePipe]
})

export class NewComponent implements OnInit {
  public resource: string;
  public siteName: string;
  public config: IuiConfig;
  public currentComponent: string;

  constructor(public router: Router,
    public apiConfig: ApiConfig,
    public adminService: AdminService,
    public routeSegment: RouteSegment,
    public uiConfig: UiConfig) { }

  ngOnInit(): void {
    this.siteName = this.apiConfig.getPortal();
    this.resource = this.routeSegment.getParam('resource');
    this.currentComponent = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
    this.uiConfig.get('admin' + this.currentComponent).subscribe((config) => {
      this.config = config.config;
    });
  }

  public onSubmit(formData: any): void {
    Object.assign(formData, { siteName: this.siteName });
    this.adminService.postResource(formData, this.resource).subscribe(data => {
      this.router.navigate(['/admin/resource/' + this.resource]);
    }, (error) => {
      console.log(error, 'this will pop up a notification showing what validations failed');
    });
  }
}
