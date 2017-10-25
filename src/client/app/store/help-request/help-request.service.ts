import { Injectable } from '@angular/core';

import { FutureApiService } from '../api/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Pojo } from '../../shared/interfaces/common.interface';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HelpRequestService {
  constructor(private http: Http) { }

  public submitHelpRequest(form: Pojo): Observable<any> {
    const headers: { [name: string]: any } = {
      'Content-Type': 'text/html',
      'Accept': 'text/html'
    };
    return this.http.post(`https://webto.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8`, form, {
      headers: new Headers(headers)
    });
    // return Observable.of({})
  }

}
