import {
  IuiConfig,
  IuiComponents,
  IuiSubComponents,
  IuiTableHeaders
} from '../../shared/interfaces/config.interface';
import { IFormFields } from '../../shared/interfaces/forms.interface.ts';
import { WzListComponent } from '../../shared/components/wz-list/wz.list.component';
import { Component, OnInit } from '@angular/core';
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
  public portal: string;
  public siteName: string;
  public configType: string;
  public sites: Array<string>;
  public currentOption: string;
  public currentComponent: string;
  public inputTypes: Array<string>;
  public config: IuiConfig;
  public components: IuiComponents;
  public subComponents: IuiSubComponents;
  public form: any;
  public configOptions: Array<IuiTableHeaders | IFormFields>;

  constructor(public router: Router,
              public apiConfig: ApiConfig,
              public uiConfig: UiConfig,
              public routeSegment: RouteSegment,
              public configService: ConfigService) {
                this.sites = [];
                this.inputTypes = ['text', 'email', 'password', 'select', 'radio'];
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
        data.items.reduce((previous: Array<string>, current: IuiConfig) => {
          previous.push(current.siteName);
          return previous;
        }, this.sites);
      });
    }
  }

  public getConfig(): void {
    this.configService.getUiConfig(this.siteName).subscribe(data => {
      this.config = data;
      this.components = data.components;
    });
  }

  public goToSite(siteName: string): void {
    this.router.navigate(['admin/ui-config/', siteName]);
  }

  public show(component: string): void {
    this.reset();
    this.currentComponent = component;
    this.subComponents = this.components[component].config;
  }

  public buildForm(configOption: string): void {
    this.form = this.subComponents[configOption];
  }

  public showSubItems(configOption: string): void {
    this.currentOption = configOption;
    this.configOptions = this.subComponents[configOption].items;
  }

  public buildSubItemForm(configOptionIndex: number): void {
    this.form = this.configOptions[configOptionIndex];
  }

  public removeItem(itemIndex: number): void {
    this.configOptions.splice(itemIndex, 1);
    this.update(this.config);
  }

  public addItem(form: any): void {
    let blankForm: any = this.form = {name: '', label: '', type: '', value: '', validation: ''};
    switch (form.type) {
      case 'text':
        blankForm.type = 'text';
        break;
      case 'password':
        blankForm.type = 'password';
        break;
      case 'email':
        blankForm.type = 'email';
        break;
      default:
        break;
    }
    this.form = blankForm;
    this.configOptions.push(this.form);
  }

  public onSubmit(): void {
    this.update(this.config);
    this.reset();
  }

  public reset(): void {
    this.currentComponent = null;
    this.currentOption = null;
    this.subComponents = null;
    this.configOptions = null;
    this.form = null;
  }

  public update(formValue: IuiConfig): void {
    this.reset();
    this.configService.update(formValue).subscribe((res) => {
      console.warn('Success!');
      this.uiConfig.set(res.json());
    });
  }
}
