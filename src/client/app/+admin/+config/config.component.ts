import { Component, OnInit, OnDestroy } from '@angular/core';
import { UiConfig } from '../../shared/services/ui.config';
import { IuiConfig } from '../../shared/interfaces/config.interface';
import { ValuesPipe } from '../../shared/pipes/values.pipe';
import { ConfigService } from '../services/config.service';
import { WzListComponent } from '../../shared/components/wz-list/wz.list.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'admin-config',
  templateUrl: 'config.html',
  pipes: [ValuesPipe],
  directives: [WzListComponent]
})

export class ConfigComponent implements OnInit, OnDestroy {

  public config: IuiConfig;
  public uiConfigs: Array<IuiConfig>;
  public siteConfigs: Array<Object>;
  public headers: Array<Object>;
  private configSubscription: Subscription;
  private uiConfigSubscription: Subscription;
  private siteConfigSubscription: Subscription;

  constructor(public uiConfig: UiConfig,
              public configService: ConfigService,
              public router: Router) { }

  ngOnInit(): void {
    this.configSubscription = this.uiConfig.get().subscribe(config => {
      this.config = config;
      this.headers = config.components.configuration.config.tableHeaders.items;
    });
    this.getConfigs();
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
    this.uiConfigSubscription.unsubscribe();
    this.siteConfigSubscription.unsubscribe();
  }

  public getConfigs(): void {
    this.uiConfigSubscription = this.configService.getUi().subscribe(data => {
      this.uiConfigs = data.items;
      this.uiConfigs.forEach(item => {
        Object.assign(item, {lastUpdateBy: 'Ross Edfort', type: 'ui'});
      });
    });
    this.siteConfigSubscription = this.configService.getSite().subscribe(data => {
      this.siteConfigs = data.items;
      this.siteConfigs.forEach(item => {
        Object.assign(item, {lastUpdateBy: 'Ross Edfort', type: 'site'});
      });
    });
  }
}
