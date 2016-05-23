import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class ConfigService {

  private http: Http;
  private apiConfig: ApiConfig;
  private uiApiUrl: string;
  private siteApiUlr: string;

  constructor(http: Http, apiConfig: ApiConfig) {
    this.http = http;
    this.apiConfig = apiConfig;
    this.uiApiUrl = this.apiConfig.baseUrl() + 'api/identities/v1/configuration/site/';
    this.siteApiUlr = this.apiConfig.baseUrl() + 'api/identities/v1/site/';
  }

  public getUi(): Observable<any> {
    return this.http.get(this.uiApiUrl + 'search',
      { headers: this.apiConfig.authHeaders() }
    );
  }

  public getSite(): Observable<any> {
    return this.http.get(this.siteApiUlr + 'search',
      { headers: this.apiConfig.authHeaders() }
    );
  }

  public update(data: any): Observable<any> {
    return this.http.put(this.uiApiUrl + '1',
      data, { headers: this.apiConfig.authHeaders() });
  }
}
