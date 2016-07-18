import { Observable} from 'rxjs/Rx';
import { Store, Reducer, Action} from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../../shared/services/api.config';
import { Http, Response } from '@angular/http';

const initAsset: any = { clipData: [], common: [], primary: [], secondary: [], filter: '', name: '' };

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
    public store: Store<any>,
    public _apiConfig: ApiConfig,
    public _http: Http) {
    this.asset = this.store.select('asset');
  }

  public initialize(id: any): Observable<any> {
    return this._http
      .get(this._apiConfig.baseUrl() + 'api/assets/v1/clip/' + id + '/clipDetail',
      { headers: this._apiConfig.authHeaders() }
      )
      .map((res: Response) => this.set({ type: 'SET_ASSET', payload: res.json() }));
  }

  public set(payload: any): void {
    this.store.dispatch(payload);
  }

  public reset(): void {
    this.store.dispatch({ type: 'RESET' });
  }

}
