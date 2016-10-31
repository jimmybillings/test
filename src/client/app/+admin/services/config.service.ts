import { Injectable } from '@angular/core';
import { UiConfigInterface, SiteConfig, AdminSiteResponse } from '../../shared/interfaces/admin.interface';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';

@Injectable()
export class ConfigService {
  constructor(private api: ApiService) { }

  public getUiConfigIndex(): Observable<Array<UiConfigInterface>> {
    return this.api.get(Api.Identities, 'configuration/site/search').map((response: any) => {
      response.items.forEach((item: any) => {
        Object.assign(item, { lastUpdateBy: 'Ross Edfort', type: 'ui' });
      });
      return response.items;
    });
  }

  public getSiteConfigIndex(): Observable<Array<SiteConfig>> {
    return this.api.get(Api.Identities, 'site/search').map((response: any) => {
      response.items.forEach((item: any) => {
        Object.assign(item, { lastUpdateBy: 'Ross Edfort', type: 'site' });
      });
      return response.items;
    });
  }

  public searchSiteConfig(siteName: string): Observable<SiteConfig> {
    // "as any" is needed here to allow assignment of ApiResponse to SiteConfig.
    return this.api.get(Api.Identities, 'site/search', { parameters: { q: siteName } }) as any;
  }

  public showUiConfig(site: string): Observable<any> {
    return this.api.get(Api.Identities, 'configuration/site', { parameters: { siteName: site } });
  }

  public showSiteConfig(siteId: number): Observable<AdminSiteResponse> {
    return this.api.get(Api.Identities, `site/${siteId}`);
  }

  public updateUiConfig(data: UiConfigInterface): Observable<any> {
    return this.api.put(Api.Identities, `configuration/site/${data.id}`, { body: data });
  }
}
