import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import { ApiConfig } from '../../common/config/api.config';

/**
 * Service that provides access to the api for logging user in and out.  
 */  
@Injectable()
export class ContentService {

  constructor(public http: Http, public apiConfig: ApiConfig) {}
  
  public get(page: string): Observable<any> {
    console.log(page);
    return this.http.get('http://ec2-52-32-235-105.us-west-2.compute.amazonaws.com/'+this.apiConfig.getPortal()+'/wp-json/wp/v2/pages?filter[name]='+page).map((res:Response) => res.json());
  }
}



