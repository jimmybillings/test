import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
// import { UiConfig } from '../../shared/services/ui.config';
// import { ApiConfig } from '../../shared/services/api.config';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';
// import { Router, ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'admin-edit',
  templateUrl: 'edit.html',
  directives: [WzFormComponent],
  pipes: [TranslatePipe]
})

export class EditComponent implements OnInit, OnDestroy {
  // public config: any;
  // public portal: string;
  // public resource: string;
  // public showForm: boolean;
  // public resourceId: string;
  // public currentResource: any;
  // public resourceFormItems: any;
  // public currentComponent: string;

  @Input() resource: any;
  @Input() formItems: any;
  @Output() updatedResource = new EventEmitter();

  // private sub: any;
  constructor() {
    // this.resourceFormItems = [];
    // this.portal = this.apiConfig.getPortal();
    // this.showForm = false;
  }

  ngOnInit(): void {
    console.log(this.resource, this.formItems);
    this.formItems.forEach((item: any) => {
      item.value = this.resource[item.name];
    });
    // this.sub = this.route.params.subscribe(params => {

    //   this.resourceId = params['id'];
    //   this.resource = params['resource'];

    //   this.currentComponent = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
    //   this.adminService.getResource(this.resource, this.resourceId).subscribe(data => {
    //     this.uiConfig.get('admin' + this.currentComponent).subscribe((config) => {
    //       this.resourceFormItems = config.config.editForm.items;
    //       this.resourceFormItems.forEach((item: any) => {
    //         item.value = data[item.name];
    //       });
    //       this.currentResource = data;
    //       this.config = config.config;
    //     });
    //   });
    //   setTimeout(() => { this.showForm = true; }, 250);

    // });
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  public onSubmit(formData: any): void {
    console.log(formData);
    // Object.assign(this.resource, formData);
    // this.updatedResource.emit(formData);
  }
}
