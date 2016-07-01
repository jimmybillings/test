import {
  IuiConfig,
  IuiComponents,
  IuiSubComponents,
  IuiTableHeaders
} from '../../shared/interfaces/config.interface';
import { IFormFields } from '../../shared/interfaces/forms.interface.ts';
import { WzListComponent } from '../../shared/components/wz-list/wz.list.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { ValuesPipe } from '../../shared/pipes/values.pipe';
import { ApiConfig } from '../../shared/services/api.config';
import { UiConfig } from '../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'admin-ui-config',
  templateUrl: 'ui-config.html',
  directives: [WzListComponent],
  pipes: [ValuesPipe]
})

export class UiConfigComponent implements OnInit, OnDestroy {
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
  public sub: any;

  constructor(public router: Router,
    public apiConfig: ApiConfig,
    public uiConfig: UiConfig,
    public route: ActivatedRoute,
    public configService: ConfigService) {
    this.sites = [];
    this.inputTypes = ['text', 'date', 'checkbox', 'email', 'password', 'select', 'radio', 'table header'];
  }

  ngOnInit() {
    this.portal = this.apiConfig.getPortal();
    this.sub = this.route.params.subscribe(params => {
      this.siteName = params['site'];
      if (this.portal !== 'core' && !(this.portal === this.siteName)) {
        this.router.navigate(['admin/ui-config/', this.portal]);
      } else {
        this.getConfig();
        this.configService.getUi().subscribe(data => {
          data.items.reduce((previous: Array<string>, current: IuiConfig) => {
            previous.push(current.siteName);
            return previous;
          }, this.sites);
        });
      }
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
    this.configOptions = null;
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
    this.form = null;
  }

  public addItem(form: any): void {
    let blankForm: any = { name: '', label: '', type: '', value: '', validation: '' };
    if (['text', 'email', 'password', 'date'].indexOf(form.type) > -1) {
      blankForm.type = form.type;
    } else if (['radio', 'select', 'checkbox'].indexOf(form.type) > -1) {
      blankForm.type = form.type;
      Object.assign(blankForm, { options: '' });
    } else {
      blankForm = { name: '', label: '' };
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
    this.configService.update(formValue).subscribe((res) => {
      console.log('Success!');
      this.uiConfig.set(res.json());
    });
  }
}
