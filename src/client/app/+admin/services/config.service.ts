import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { UiConfigInterface, SiteConfig, AdminUiResponse, AdminSiteResponse } from '../../shared/interfaces/admin.interface';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ConfigService {

  public uiApiUrl: string;
  public siteApiUrl: string;

  constructor(public http: Http, public apiConfig: ApiConfig) {
    this.uiApiUrl = this.apiConfig.baseUrl() + 'api/identities/v1/configuration/site/';
    this.siteApiUrl = this.apiConfig.baseUrl() + 'api/identities/v1/site/';
  }

  public getUiConfigIndex(): Observable<AdminUiResponse> {
    return this.http.get(this.uiApiUrl + 'search',
      { headers: this.apiConfig.authHeaders(), body: '' }
    ).map((res: Response) => res.json());
  }

  public getSiteConfigIndex(): Observable<AdminSiteResponse> {
    return this.http.get(this.siteApiUrl + 'search',
      { headers: this.apiConfig.authHeaders(), body: '' }
    ).map((res: Response) => res.json());
  }

  public searchSiteConfig(siteName: string): Observable<SiteConfig> {
    return this.http.get(this.siteApiUrl + 'search/?q=' + siteName,
      { headers: this.apiConfig.authHeaders(), body: '' }
    ).map((res: Response) => res.json());
  }

  public showUiConfig(site: string): Observable<any> {
    return this.http.get(this.uiApiUrl + '?siteName=' + site,
      { headers: this.apiConfig.authHeaders(), body: '' }
    ).map((res: Response) => res.json());
  }

  public showSiteConfig(siteId: number): Observable<AdminSiteResponse> {
    return this.http.get(this.siteApiUrl + siteId,
      { headers: this.apiConfig.authHeaders(), body: '' }
    ).map((res: Response) => res.json());
  }

  public updateUiConfig(data: UiConfigInterface): Observable<any> {
    return this.http.put(this.uiApiUrl + data.id,
      JSON.stringify(data), { headers: this.apiConfig.authHeaders() });
  }
}
