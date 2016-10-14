import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { UiConfigInterface, SiteConfig, AdminUiResponse, AdminSiteResponse } from '../../shared/interfaces/admin.interface';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';

@Injectable()
export class ConfigService {
  constructor(private api: ApiService) { }

  public getUiConfigIndex(): Observable<AdminUiResponse> {
    return this.api.get2(Api.Identities, 'configuration/site/search');
  }

  public getSiteConfigIndex(): Observable<AdminSiteResponse> {
    return this.api.get2(Api.Identities, 'site/search');
  }

  public searchSiteConfig(siteName: string): Observable<SiteConfig> {
    // "as any" is needed here to allow assignment of ApiResponse to SiteConfig.
    return this.api.get2(Api.Identities, 'site/search', { parameters: { q: siteName } }) as any;
  }

  public showUiConfig(site: string): Observable<any> {
    return this.api.get2(Api.Identities, 'configuration/site', { parameters: { siteName: site } });
  }

  public showSiteConfig(siteId: number): Observable<AdminSiteResponse> {
    return this.api.get2(Api.Identities, `site/${siteId}`);
  }

  public updateUiConfig(data: UiConfigInterface): Observable<any> {
    return this.api.put2(Api.Identities, `configuration/site/${data.id}`, { body: data });
  }
}
