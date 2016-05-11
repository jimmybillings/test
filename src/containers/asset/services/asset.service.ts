import { Observable} from 'rxjs/Rx';
import { Store, Reducer, Action} from '@ngrx/store';
import { Injectable } from 'angular2/core';
import { ApiConfig } from '../../../common/config/api.config';
import { Http, Response } from 'angular2/http';

const initAsset = { clipData: [], common: [], primary: [], secondary: [], filter: '', name: ''};
export const asset: Reducer<any> = (state = initAsset, action: Action) => {
  switch (action.type) {
    case 'SET_ASSET':
      return Object.assign({}, state, action.payload);
    case 'RESET':
      return Object.assign({}, initAsset);
    default:
      return state;
  }
};

@Injectable()

export class AssetService {

  public asset: Observable<any>;
  public errorMessage: any;
  

  constructor(
    private store: Store<any>,
    private _apiConfig: ApiConfig,
    private _http: Http) {
    this.asset = this.store.select('asset');
  }

  public initialize(id): Observable<any> {
    return this._http
      .get(this._apiConfig.baseUrl() +'api/assets/v1/clip/'+ id +'/detail?siteName='+ this._apiConfig.getPortal(), 
        { headers: this._apiConfig.authHeaders() }
      )
      .map((res: Response) => ({ type: 'SET_ASSET', payload: res.json() }));
  }
  
  public set(payload): void {
    this.store.dispatch(payload);
  }
  
  public reset(): void {
    this.store.dispatch({ type: 'RESET' });
  }

}
