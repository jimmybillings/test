import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
import { ApiConfig } from '../../../common/config/api.config';
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
  
  public update(data): Observable<any> {
    return this.http.put(this.apiUrl+'1', 
      data, {headers: this.apiConfig.authHeaders()});
  }
}
