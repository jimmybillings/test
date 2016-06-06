import {Component, OnInit} from '@angular/core';
import {UiConfig} from '../../shared/services/ui.config';
import {IuiConfig} from '../../shared/interfaces/config.interface';
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

  public config: IuiConfig;
  public uiConfigs: Array<IuiConfig>;
  public siteConfigs: Array<Object>;
  public headers: Array<Object>;

  constructor(public uiConfig: UiConfig,
              public configService: ConfigService,
              public router: Router) { }

  ngOnInit(): void {
    this.uiConfig.get().subscribe(config => {
      this.config = config;
      this.headers = config.components.configuration.config.tableHeaders.items;
    });
    this.getConfigs();
  }

  public getConfigs(): void {
    this.configService.getUi().subscribe(data => {
      this.uiConfigs = data.items;
      this.uiConfigs.forEach(item => {
        Object.assign(item, {lastUpdateBy: 'Ross Edfort', type: 'ui'});
      });
    });
    this.configService.getSite().subscribe(data => {
      this.siteConfigs = data.items;
      this.siteConfigs.forEach(item => {
        Object.assign(item, {lastUpdateBy: 'Ross Edfort', type: 'site'});
      });
    });
  }
}
