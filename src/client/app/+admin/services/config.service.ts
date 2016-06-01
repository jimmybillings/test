import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ConfigService {

  public configStore: Observable<any>;
  private http: Http;
  private apiConfig: ApiConfig;
  private uiApiUrl: string;
  private siteApiUrl: string;

  constructor(http: Http, apiConfig: ApiConfig) {
    this.http = http;
    this.apiConfig = apiConfig;
    this.uiApiUrl = this.apiConfig.baseUrl() + 'api/identities/v1/configuration/site/';
    this.siteApiUrl = this.apiConfig.baseUrl() + 'api/identities/v1/site/';
  }

  public getUi(): Observable<any> {
    return this.http.get(this.uiApiUrl + 'search',
      { headers: this.apiConfig.authHeaders() }
    );
  }

  public getSite(): Observable<any> {
    return this.http.get(this.siteApiUrl + 'search',
      { headers: this.apiConfig.authHeaders() }
    );
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

  public update(data: any): Observable<any> {
    return this.http.put(this.uiApiUrl + '1',
      data, { headers: this.apiConfig.authHeaders() });
  }
}
