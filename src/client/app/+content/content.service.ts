import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { ApiConfig } from '../shared/services/api.config';

/**
 * Service that provides access to the api for logging user in and out.  
 */
@Injectable()
export class ContentService {

  constructor(public http: Http, public apiConfig: ApiConfig) { }

  public get(page: string): Observable<any> {
    return this.http.get(
      this.apiConfig.cms('root') +
      this.apiConfig.getPortal() +
      this.apiConfig.cms('path') +
      this.apiConfig.cms('query') +
      page).map((res: Response) => res.json());
  }
}



