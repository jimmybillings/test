import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { IuiConfig } from '../../shared/interfaces/config.interface';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ConfigService {

  public uiApiUrl: string;
  public siteApiUrl: string;

  constructor(public http: Http, public apiConfig: ApiConfig) {
    this.uiApiUrl = this.apiConfig.baseUrl() + 'api/identities/v1/configuration/site/';
    this.siteApiUrl = this.apiConfig.baseUrl() + 'api/identities/v1/site/';
  }

  public getUi(): Observable<any> {
    return this.http.get(this.uiApiUrl + 'search',
      { headers: this.apiConfig.authHeaders() }
    ).map((res: Response) => res.json());
  }

  public getSite(): Observable<any> {
    return this.http.get(this.siteApiUrl + 'search',
      { headers: this.apiConfig.authHeaders() }
    ).map((res: Response) => res.json());
  }

  public search(siteName: string): Observable<any> {
    return this.http.get(this.siteApiUrl + 'search/?q=' + siteName,
      { headers: this.apiConfig.authHeaders() }
    ).map((res: Response) => res.json());
  }

  public getUiConfig(site: string): Observable<any> {
    return this.http.get(this.uiApiUrl + '?siteName=' + site,
      { headers: this.apiConfig.authHeaders() }
    ).map((res: Response) => res.json());
  }

  public getSiteConfig(siteId: number): Observable<any> {
    return this.http.get(this.siteApiUrl + siteId,
      { headers: this.apiConfig.authHeaders() }
    ).map((res: Response) => res.json());
  }

  public update(data: IuiConfig): Observable<any> {
    return this.http.put(this.uiApiUrl + data.id,
      JSON.stringify(data), { headers: this.apiConfig.authHeaders() });
  }
}
