import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class ConfigService {

  private http: Http;
  private apiConfig: ApiConfig;
  private apiUrl: string;

  constructor(http: Http, apiConfig: ApiConfig) {
    this.http = http;
    this.apiConfig = apiConfig;
    this.apiUrl = this.apiConfig.baseUrl() + 'api/identities/v1/configuration/site/';
  }

  public update(data: any): Observable<any> {
    return this.http.put(this.apiUrl + '1',
      data, { headers: this.apiConfig.authHeaders() });
  }
}
