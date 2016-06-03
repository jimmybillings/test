import { WzListComponent } from '../../shared/components/wz-list/wz.list.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/common';
import { Router, RouteSegment } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { ValuesPipe } from '../../shared/pipes/values.pipe';
import { ApiConfig } from '../../shared/services/api.config';
import { UiConfig } from '../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'admin-ui-config',
  templateUrl: 'ui-config.html',
  providers: [ConfigService],
  directives: [WzListComponent],
  pipes: [ValuesPipe]
})

export class UiConfigComponent implements OnInit {
  public subComponent: string;
  public configType: string;
  public siteName: string;
  public portal: string;
  public subComponents: any;
  public formItems: any;
  public config: any;
  public form: Object;
  public sites: Array<any>;

  constructor(public router: Router,
              public apiConfig: ApiConfig,
              public uiConfig: UiConfig,
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
    });
  }

  public goToSite(siteName: string): void {
    this.router.navigate(['admin/ui-config/', siteName]);
  }

  public show(item: string): void {
    this.subComponents = this.config.components[item].config;
  }

  public buildForm(item: string): void {
    let object = this.subComponents[item];
    this.form = {value: object.value};
  }

  public showSubItems(item: string): void {
    let object = this.subComponents[item];
    this.subComponent = item;
    this.formItems = object.items;
  }

  public buildSubItemForm(itemIndex: string): void {
    this.form = this.formItems[itemIndex];
  }

  public onSubmit(formValue: any): void {
    this.subComponents = null;
    this.formItems = null;
    this.form = null;
    this.configService.update(this.config.id, JSON.stringify(formValue)).subscribe((res) => {
      console.warn('Success!');
      this.uiConfig.set(res.json());
    });
  }
}
