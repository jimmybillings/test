import {Component, OnInit} from '@angular/core';
import {UiConfig} from '../../shared/services/ui.config';
import {ValuesPipe} from '../../shared/pipes/values.pipe';
import {FormBuilder, Validators, ControlGroup, FORM_DIRECTIVES, Control} from '@angular/common';
import {ConfigService} from '../services/config.service';
import {WzListComponent} from '../../shared/components/wz-list/wz.list.component';
import {Router} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'admin-config',
  templateUrl: 'config.html',
  pipes: [ValuesPipe],
  directives: [FORM_DIRECTIVES, WzListComponent],
  providers: [ConfigService]
})

export class ConfigComponent implements OnInit {

  public config: any;
  public uiItems: Array<any>;
  public siteItems: Array<any>;
  public headers: Array<any>;
  private configForm: ControlGroup;

  constructor(public uiConfig: UiConfig, public fb: FormBuilder, public configService: ConfigService, public router: Router) { }

  ngOnInit(): void {
    this.uiConfig.get().subscribe(config => this.config = config);
    this.setForm();
    this.getConfigs();
    this.headers = [
      {'name': 'siteName', 'label': 'Site'},
      {'name': 'lastUpdated', 'label': 'Last Updated'},
      {'name': 'lastUpdateBy', 'label': 'Last Update By'}
    ];
  }

  public getConfigs(): void {
    this.configService.getUi().subscribe(data => {
      this.uiItems = data.items;
      this.uiItems.forEach(item => {Object.assign(item, {lastUpdateBy: 'Ross Edfort', type: 'ui'});});
    });
    this.configService.getSite().subscribe(data => {
      this.siteItems = data.items;
      this.siteItems.forEach(item => {Object.assign(item, {lastUpdateBy: 'Ross Edfort', type: 'site'});});
    });
  }

  public setForm(): void {
    this.configForm = this.fb.group({ config: [JSON.stringify(this.config, undefined, 4), Validators.required] });
  }

  public navigateToShowUi(record: any): void {
    this.router.navigate(['admin/ui-config/', record.siteName]);
  }

  public navigateToShowSite(record: any): void {
    this.router.navigate(['admin/site-config/', record.siteName]);
  }

  public onSubmit(form: any): void {
    this.configService.update(form.config)
      .subscribe((res) => {
        this.uiConfig.set(res.json());
        (<Control>this.configForm.controls['config']).updateValue(JSON.stringify(res.json(), undefined, 4));
      });
  }
}
