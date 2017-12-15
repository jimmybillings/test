import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FutureApiService } from '../api/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { createClient, Entry } from 'contentful';

const CONFIG = {
  space: '9f7tranrpc7k',
  accessToken: 'b4975cae9e5642e38f23ce25f2d3a11486bdc627d6c96cd1a4134e69e6988e91',

  contentTypeIds: {
    product: 'footer'
  }
}

@Injectable()
export class CmsService {
  private cdaClient = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken
  });

  constructor(private apiService: FutureApiService) { }

  public loadFooter(query?: object): Observable<any> {
    return Observable.fromPromise(this.cdaClient.getEntry('5RhV22QxcAosk0y0sUqEuS'));
  }
}
