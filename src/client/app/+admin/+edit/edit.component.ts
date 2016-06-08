import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { UiConfig } from '../../shared/services/ui.config';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';
import { Router, RouteSegment } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'admin-edit',
  templateUrl: 'edit.html',
  providers: [AdminService],
  directives: [WzFormComponent]
})

export class EditComponent implements OnInit {
  public config: any;
  public resource: any;
  public resourceId: string;
  public resourceType: string;
  public resourceFormItems: any;
  public currentComponent: string;

  constructor(public adminService: AdminService,
              public router: Router,
              public uiConfig: UiConfig,
              public routeSegment: RouteSegment) {
                this.resourceFormItems = [];
              }

  ngOnInit(): void  {
    this.resourceId = this.routeSegment.getParam('id');
    this.resourceType = this.routeSegment.getParam('resource');
    this.currentComponent = this.resourceType.charAt(0).toUpperCase() + this.resourceType.slice(1);
    this.adminService.getResource(this.resourceType, this.resourceId).subscribe(data => {
      this.uiConfig.get('admin' + this.currentComponent).subscribe((config) => {
        this.resourceFormItems = config.config.editForm.items;
        this.resourceFormItems.forEach((item: any) => {
          item.value = data[item.name];
        });
        this.config = config.config;
      });
    });
  }

  public onSubmit(formData: any): void {
    console.log(formData);
  }
}
