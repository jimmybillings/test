import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { ApiService } from '../../shared/services/api.service';
import { Api, ApiOptions } from '../../shared/interfaces/api.interface';

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
    public api: ApiService) {
    this.data = this.store.select('asset');
  }

  public initialize(id: any): Observable<any> {
    return this.api.get('api/assets/v1/clip/' + id + '/clipDetail')
      .map((res: Response) => { this.set({ type: 'SET_ASSET', payload: res.json() }); });
  }

  public set(payload: any): void {
    this.store.dispatch(payload);
  }

  public reset(): void {
    this.store.dispatch({ type: 'RESET' });
  }

  public downloadComp(id: any, compType: any): Observable<any> {
    return this.api.get('api/assets/v1/renditionType/downloadUrl/' + id + '?type=' + compType)
      .map((res) => { return res.json(); });
  }

  public getPrice(id: any): Observable<any> {
    return this.api.get('api/orders/v1/priceBook/price/' + id + '?region=AAA')
      .map((res) => {
        this.setPrice(res.json());
        return res.json();
      });
  }

  public getshareLink(id: any, accessStartDate: any, accessEndDate: any): Observable<any> {
    return this.api.post('api/identities/v1/accessInfo',
      JSON.stringify({
        'type': 'asset',
        'accessInfo': id,
        'accessStartDate': accessStartDate,
        'accessEndDate': accessEndDate
      }))
      .map(res => {
        return res.json();
      });
  }

  public createShareLink(shareLink: any): Observable<any> {
    return this.api.post('api/identities/v1/accessInfo',
      JSON.stringify(shareLink))
      .map(res => {
        return res.json();
      });
  }

  public getData(id: any, share_token?: string): Observable<any> {
    let options: ApiOptions = { loading: true };
    if (share_token) options.overridingToken = share_token;
    return this.api.get2(Api.Assets, 'clip/' + id + '/clipDetail', options)
      .map((res) => {
        this.setActiveAsset(res);
        return res;
      });
  }

  public setActiveAsset(asset: any): void {
    this.set({
      type: 'SET_ASSET', payload: {
        assetId: asset.assetId,
        clipThumbnailUrl: asset.clipThumbnailUrl,
        clipUrl: asset.clipUrl,
        detailTypeMap: asset.detailTypeMap,
        hasDownloadableComp: asset.hasDownloadableComp,
        resourceClass: asset.resourceClass,
      }
    });
  }

  public setPrice(price: any) {
    this.set({
      type: 'SET_ASSET', payload: {
        price: price.price
      }
    });
  }
}
