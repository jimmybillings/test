import { Component } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
import { WzForm } from '../../../components/wz-form/wz.form.component';
import { UiConfig } from '../../../common/config/ui.config';

@Component({
  selector: 'admin-new',
  templateUrl: 'containers/admin/new/new.html',
  directives: [WzForm]
})

export class New {
  public resource: string;
  public currentComponent: string;
  public config: any;

  constructor(public router: Router,
              public routeParams: RouteParams,
              public uiConfig: UiConfig) {}

  ngOnInit(): void {
    this.resource = this.routeParams.get('resource');
    this.currentComponent = this.resource.charAt(0).toUpperCase() + this.resource.slice(1);
    this.uiConfig.get('admin' + this.currentComponent).subscribe((config) => {
      this.config = config.config;
    });
  }

  public onSubmit(formData: any): void {
    console.log(formData);
  }
}
