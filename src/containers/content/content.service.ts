import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import { ApiConfig } from '../../common/config/api.config';

/**
 * Service that provides access to the api for logging user in and out.  
 */  
@Injectable()
export class ContentService {

  constructor(public http: Http, public apiConfig: ApiConfig) {}
  
  public get(page: string): Observable<any> {
    return this.http.get(
      this.apiConfig.cms('root') + 
      this.apiConfig.getPortal() + 
      this.apiConfig.cms('path') + 
      this.apiConfig.cms('query') + 
      page).map((res:Response) => res.json());
  }
}



