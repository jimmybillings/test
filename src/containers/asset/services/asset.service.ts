import { Observable} from 'rxjs/Observable';
import { Store, Reducer, Action} from '@ngrx/store';
import { Injectable } from 'angular2/core';
import { ApiConfig } from '../../../common/config/api.config';
import { Http, Response } from 'angular2/http';
import { Error } from '../../../common/services/error.service';

const initAsset = { clipData: [] };
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
  private _apiUrl: string;
  

  constructor(
    private store: Store<any>,
    private _apiConfig: ApiConfig,
    private _http: Http,
    public error: Error) {
    this.asset = this.store.select('asset');
    this._apiUrl = this._apiConfig.baseUrl() + 'api/assets/v1/clip/';
  }

  public set(id): void {
    this._http.get(this._apiUrl + id, { headers: this._apiConfig.authHeaders() })
      .map((res: Response) => res.json())
      .subscribe(asset => this.store.dispatch({ type: 'SET_ASSET', payload: asset }),
                 error => this.error.handle(error));
  }
  
  public reset() {
    this.store.dispatch({ type: 'RESET' });
  }

}
