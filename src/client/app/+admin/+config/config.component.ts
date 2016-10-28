import { Component, OnInit } from '@angular/core';
import { UiConfig } from '../../shared/services/ui.config';
import { TableHeaders, AdminSiteResponse, AdminUiResponse } from '../../shared/interfaces/admin.interface';
import { ConfigService } from '../services/config.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'admin-config',
  templateUrl: 'config.html'
})

export class ConfigComponent implements OnInit {
  public uiConfigs: Observable<AdminUiResponse>;
  public siteConfigs: Observable<AdminSiteResponse>;
  public headers: Array<TableHeaders>;

  constructor(public uiConfig: UiConfig,
    public configService: ConfigService,
    public router: Router) { }

  ngOnInit(): void {
    this.uiConfig.get('configuration').take(1).subscribe(config => {
      this.headers = config.config.tableHeaders.items;
    });
    this.uiConfigs = this.configService.getUiConfigIndex();
    this.siteConfigs = this.configService.getSiteConfigIndex();
  }
}
