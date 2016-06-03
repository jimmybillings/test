import { WzListComponent } from '../../shared/components/wz-list/wz.list.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/common';
import { Router, RouteSegment } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { ValuesPipe } from '../../shared/pipes/values.pipe';
import { ApiConfig } from '../../shared/services/api.config';

@Component({
  moduleId: module.id,
  selector: 'admin-ui-config',
  templateUrl: 'ui-config.html',
  providers: [ConfigService],
  directives: [WzListComponent],
  pipes: [ValuesPipe]
})

export class UiConfigComponent implements OnInit {
  public siteName: string;
  public portal: string;
  public form: any;
  public config: any;
  public subComponents: any;
  public items: Array<any>;
  public controls: Array<any>;
  public subItems: Array<any>;
  public formItems: Array<any>;
  public sites: Array<any>;
  public configType: string;

  constructor(public router: Router,
              public apiConfig: ApiConfig,
              public fb: FormBuilder,
              public routeSegment: RouteSegment,
              public configService: ConfigService) {
                this.sites = [];
              }

  ngOnInit() {
    this.portal = this.apiConfig.getPortal();
    this.siteName = this.routeSegment.getParam('site');
    if (this.portal !== 'core' && !(this.portal === this.siteName)) {
      this.router.navigate(['admin/ui-config/', this.portal]);
    } else {
      this.configType = this.routeSegment.urlSegments[0].segment.split('-')[0];
      this.getConfig();
      this.configService.getUi().subscribe(data => {
        data.items.reduce((previous: any, current: any) => {
          previous.push(current.siteName);
          return previous;
        }, this.sites);
      });
    }
  }

  public getConfig(): void {
    this.configService.getUiConfig(this.siteName).subscribe(data => {
      this.config = data;
      this.items = Object.keys(data.components);
    });
  }

  public goToSite(siteName: string): void {
    this.router.navigate(['admin/ui-config/', siteName]);
  }

  public show(item: any): void {
    this.subComponents = this.config.components[item].config;
    this.subItems = Object.keys(this.subComponents);
  }

  public buildForm(item: any): void {
    let object = this.subComponents[item];
    if (object.items) {
      this.formItems = object.items;
    } else {
      this.form = this.fb.group({value: object.value});
      this.controls = Object.keys(this.form.controls);
    }
  }

  public buildFieldForm(itemIndex: string): any {
    this.form = this.formItems[itemIndex];
    this.controls = Object.keys(this.form);
    console.log(this.form, this.controls);
  }

  public onSubmit(formValue: any): void {
    debugger;
  }
}
