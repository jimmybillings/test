import { Observable} from 'rxjs/Rx';
import { Store, ActionReducer, Action} from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../../shared/services/api.config';
import { Response } from '@angular/http';
import { ApiService } from '../../shared/services/api.service';

const initAsset: any = { clipData: [], common: [], primary: [], secondary: [], filter: '', name: '', price: 0 };

export const asset: ActionReducer<any> = (state = initAsset, action: Action) => {
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

  public data: Observable<any>;
  public errorMessage: any;


  constructor(
    public store: Store<any>,
    public apiConfig: ApiConfig,
    public api: ApiService) {
    this.data = this.store.select('asset');
  }

  public initialize(id: any): Observable<any> {
    return this.api.get(this.apiConfig.baseUrl() + 'api/assets/v1/clip/' + id + '/clipDetail')
      .map((res: Response) => { this.set({ type: 'SET_ASSET', payload: res.json() }); });
  }

  public set(payload: any): void {
    this.store.dispatch(payload);
  }

  public reset(): void {
    this.store.dispatch({ type: 'RESET' });
  }

  public downloadComp(id: any, compType: any): Observable<any> {
    return this.api.get(this.apiConfig.baseUrl() + 'api/assets/v1/renditionType/downloadUrl/' + id + '?type=' + compType)
      .map((res) => { return res.json(); });
  }

  public getPrice(id: any): Observable<any> {
    return this.api.get(this.apiConfig.baseUrl() + 'api/orders/v1/priceBook/price/' + id + '?region=AAA')
      .map((res) => { return res.json(); });
  }

  public getData(id: any): Observable<any> {
    return this.api.get(this.apiConfig.baseUrl() + 'api/assets/v1/clip/' + id + '/clipDetail', {}, true)
      .map((res) => { return res.json(); });
  }

  public setActiveAsset(asset: any, price: any): void {
    this.set({
      type: 'SET_ASSET', payload: {
        assetId: asset.assetId,
        clipThumbnailUrl: asset.clipThumbnailUrl,
        clipUrl: asset.clipUrl,
        detailTypeMap: asset.detailTypeMap,
        hasDownloadableComp: asset.hasDownloadableComp,
        resourceClass: asset.resourceClass,
        price: price.price
      }
    });
  }
}
