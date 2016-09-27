import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { UiConfigInterface, SiteConfig, AdminUiResponse, AdminSiteResponse } from '../../shared/interfaces/admin.interface';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';

@Injectable()
export class ConfigService {

  public uiApiUrl: string;
  public siteApiUrl: string;

  constructor(public api: ApiService) {
    this.uiApiUrl = 'api/identities/v1/configuration/site/';
    this.siteApiUrl = 'api/identities/v1/site/';
  }

  public getUiConfigIndex(): Observable<AdminUiResponse> {
    return this.api.get(this.uiApiUrl + 'search')
      .map((res: Response) => res.json());
  }

  public getSiteConfigIndex(): Observable<AdminSiteResponse> {
    return this.api.get(this.siteApiUrl + 'search')
      .map((res: Response) => res.json());
  }

  public searchSiteConfig(siteName: string): Observable<SiteConfig> {
    return this.api.get(this.siteApiUrl + 'search/?q=' + siteName)
      .map((res: Response) => res.json());
  }

  public showUiConfig(site: string): Observable<any> {
    return this.api.get(this.uiApiUrl + '?siteName=' + site)
      .map((res: Response) => res.json());
  }

  public showSiteConfig(siteId: number): Observable<AdminSiteResponse> {
    return this.api.get(this.siteApiUrl + siteId)
      .map((res: Response) => res.json());
  }

  public updateUiConfig(data: UiConfigInterface): Observable<any> {
    return this.api.put(this.uiApiUrl + data.id, JSON.stringify(data));
  }
}
