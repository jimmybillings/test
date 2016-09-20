import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable} from 'rxjs/Rx';
import { ApiConfig } from '../shared/services/api.config';
import { ApiService } from '../shared/services/api.service';

/**
 * Service that provides access to the api for logging user in and out.  
 */
@Injectable()
export class ContentService {

  constructor(public api: ApiService, public apiConfig: ApiConfig) { }

  public get(page: string): Observable<any> {
    return this.api.get(
      this.apiConfig.cms('root') +
      this.apiConfig.getPortal() +
      this.apiConfig.cms('path') +
      this.apiConfig.cms('query') +
      page).map((res: Response) => res.json());
  }
}



