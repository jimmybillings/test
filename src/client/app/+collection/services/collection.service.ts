import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { Http } from '@angular/http';
// import { RequestOptions, URLSearchParams } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable} from 'rxjs/Rx';
// import { CurrentUser} from '../../shared/services/current-user.model';
// import { Store, Reducer, Action} from '@ngrx/store';
import { Store} from '@ngrx/store';

@Injectable()
export class CollectionService {

  public Collection: Observable<any>;
  public errorMessage: any;


  constructor(
    public store: Store<any>,
    public _apiConfig: ApiConfig,
    public _http: Http) {
  }
}
