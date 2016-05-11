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
    this.currentComponent = this.router.parent.currentInstruction.component.routeName;
    this.resource = this.currentComponent.toLowerCase();
    // this.uiConfig.get('new' + this.currentComponent).subscribe((config) => {
    //   this.config = config.config;
    // });
  }
  
  public onSubmit(formData: any): void {
    console.log(formData);
  }
}
