import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable} from 'rxjs/Rx';
import { ApiConfig } from '../shared/services/api.config';
import { Http } from '@angular/http';

/**
 * Service that provides access to the api for logging user in and out.  
 */
@Injectable()
export class ContentService {

  constructor(public apiConfig: ApiConfig, public http: Http) { }

  public get(page: string): Observable<any> {
    return this.http.get(
      this.apiConfig.cms('root') +
      this.apiConfig.getPortal() +
      this.apiConfig.cms('path') +
      this.apiConfig.cms('query') +
      page).map((res: Response) => res.json());
  }
}



