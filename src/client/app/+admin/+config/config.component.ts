import {Component, OnInit} from '@angular/core';
import {UiConfig} from '../../shared/services/ui.config';
import {ValuesPipe} from '../../shared/pipes/values.pipe';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {ConfigService} from '../services/config.service';
import {WzListComponent} from '../../shared/components/wz-list/wz.list.component';
import {Router} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'admin-config',
  templateUrl: 'config.html',
  pipes: [ValuesPipe, TranslatePipe],
  directives: [WzListComponent],
  providers: [ConfigService]
})

export class ConfigComponent implements OnInit {

  public config: any;
  public uiItems: Array<any>;
  public siteItems: Array<any>;
  public headers: Array<any>;

  constructor(public uiConfig: UiConfig, public configService: ConfigService, public router: Router) { }

  ngOnInit(): void {
    this.uiConfig.get().subscribe(config => this.config = config);
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

  public navigateToShowUi(record: any): void {
    this.router.navigate(['admin/ui-config/', record.siteName]);
  }

  public navigateToShowSite(record: any): void {
    this.router.navigate(['admin/site-config/', record.siteName]);
  }
}
