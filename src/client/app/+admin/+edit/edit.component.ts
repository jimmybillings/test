import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { AdminService } from '../services/admin.service';
import { UiConfig } from '../../shared/services/ui.config';
import { ApiConfig } from '../../shared/services/api.config';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';
import { Router, RouteSegment } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'admin-edit',
  templateUrl: 'edit.html',
  providers: [AdminService],
  directives: [WzFormComponent],
  pipes: [TranslatePipe]
})

export class EditComponent implements OnInit {
  public config: any;
  public portal: string;
  public resource: string;
  public showForm: boolean;
  public resourceId: string;
  public currentResource: any;
  public resourceFormItems: any;
  public currentComponent: string;

  constructor(public adminService: AdminService,
              public router: Router,
              public uiConfig: UiConfig,
              public apiConfig: ApiConfig,
              public routeSegment: RouteSegment) {
                this.resourceFormItems = [];
                this.portal = this.apiConfig.getPortal();
                this.showForm = false;
              }

  ngOnInit(): void  {
    this.resourceId = this.routeSegment.getParam('id');
    this.resource = this.routeSegment.getParam('resource');
    this.currentComponent = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
    this.adminService.getResource(this.resource, this.resourceId).subscribe(data => {
      this.uiConfig.get('admin' + this.currentComponent).subscribe((config) => {
        this.resourceFormItems = config.config.editForm.items;
        this.resourceFormItems.forEach((item: any) => {
          item.value = data[item.name];
        });
        this.currentResource = data;
        this.config = config.config;
      });
    });
    setTimeout(() => { this.showForm = true; }, 250);
  }

  public onSubmit(formData: any): void {
    Object.assign(this.currentResource, formData);
    this.adminService.put(this.resource, this.resourceId, this.currentResource).subscribe(data => {
      console.warn('Success!', data);
      this.router.navigate(['/admin/resource/', this.resource]);
    });
  }
}
