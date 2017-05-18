import { Observable } from 'rxjs/Observable';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { ApiService } from '../../shared/services/api.service';
import { Api, ApiOptions, ApiParameters } from '../../shared/interfaces/api.interface';
import { AssetState } from '../../shared/interfaces/asset.interface';
import { PriceAttribute } from '../../shared/interfaces/commerce.interface';
import { CurrentUserService } from '../../shared/services/current-user.service';
import * as commerce from '../interfaces/commerce.interface';
import * as common from '../interfaces/common.interface';
import { EnhancedAsset } from '../interfaces/enhanced-asset';


export function asset(state: any = {}, action: Action) {
  switch (action.type) {
    case 'SET_ASSET':
      return Object.assign({}, action.payload);
    case 'SET_VIRTUAL_PROPERTIES':
      return Object.assign({}, state, action.payload);
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
    public api: ApiService,
    private currentUser: CurrentUserService) {
    this.data = this.store.select('asset');
  }

  public initialize(id: any): Observable<any> {
    return this.api.get(Api.Assets, `clip/${id}/clipDetail`)
      .do(response => this.set({ type: 'SET_ASSET', payload: response }));
  }

  public set(action: Action): void {
    this.store.dispatch(action);
  }

  public downloadComp(id: any, compType: any): Observable<any> {
    return this.api.get(Api.Assets, `renditionType/downloadUrl/${id}`, { parameters: { type: compType } });
  }

  // TODO:  Rewrite this a bit?  After creating getPriceFor(asset, attributes) below,
  // the only remaining use of this method is called from AssetComponent as:
  //     this.assetService.getPrice(this.assetService.state.assetId, attributes);
  // The component shouldn't need to ask this service for its state's assetId,
  // only to pass it to this method in the same service!  And duration is no longer used in this method.
  public getPrice(id: any, attributes?: any, duration?: { startSecond: number, endSecond: number }): Observable<any> {
    let formatedAttributes = attributes ? this.formatAttributes(attributes) : null;
    let parameters = formatedAttributes ? { region: 'AAA', attributes: formatedAttributes } : { region: 'AAA' };
    parameters = duration ? Object.assign(parameters, duration) : parameters;
    return this.api.get(Api.Orders, `priceBook/price/${id}`, { parameters }).map((data: any) => data.price);
  }

  public getPriceFor(asset: commerce.Asset, attributes?: any): Observable<any> {
    const enhancedAsset: EnhancedAsset = this.enhance(asset);
    const parameters: ApiParameters =
      Object.assign(
        { region: 'AAA' },
        attributes ? { attributes: this.formatAttributes(attributes) } : null,
        enhancedAsset.isSubclipped ? this.formatDurationParametersFor(enhancedAsset) : null
      );

    return this.api.get(Api.Orders, `priceBook/price/${asset.assetId}`, { parameters }).map((data: any) => data.price);
  }

  public getshareLink(id: any, accessStartDate: any, accessEndDate: any): Observable<any> {
    return this.api.post(
      Api.Identities,
      'accessInfo',
      { body: { type: 'asset', accessInfo: id, accessStartDate: accessStartDate, accessEndDate: accessEndDate } }
    );
  }

  public createShareLink(shareLink: any): Observable<any> {
    return this.api.post(Api.Identities, 'accessInfo', { body: shareLink });
  }

  public getData(assetParams: any): Observable<any> {
    let options: ApiOptions = { loading: true };
    if (assetParams.share_key) options.overridingToken = assetParams.share_key;

    return this.api.get(Api.Assets, 'clip/' + assetParams.assetId + '/clipDetail', options)
      .do((res) => this.setActiveAsset(Object.assign(res, assetParams)));

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
        transcodeTargets: asset.transcodeTargets || [],
        price: asset.price,
        uuid: asset.uuid || null,
        timeStart: asset.timeStart || null,
        timeEnd: asset.timeEnd || null,
      }
    });
  }

  public getPriceAttributes(priceModel?: string): Observable<Array<PriceAttribute>> {
    priceModel = priceModel ? priceModel.split(' ').join('') : 'RightsManaged';
    return this.api.get(
      Api.Orders,
      'priceBook/priceAttributes',
      { parameters: { region: 'AAA', priceModel: priceModel } }
    ).map((data: any) => {
      data.list[0].primary = true;
      return data.list;
    });
  }

  public getSpeedviewData(assetId: number): Observable<any> {
    let path: string = this.currentUser.loggedIn() ? `assetInfo/view/SpeedView` : `assetInfo/anonymous/view/SpeedView`;
    return this.api.get(Api.Assets, `${path}/${assetId}`);
  }

  public getClipPreviewData(assetId: number): Observable<any> {
    const viewType: ApiOptions = { parameters: { 'useType': 'clipPreview' } };
    return this.api.get(Api.Assets, `renditionType/${assetId}`, viewType);
  }

  public get state(): any {
    let state: any = {};
    this.data.take(1).subscribe(f => state = f);
    return state;
  }

  public enhance(asset: commerce.Asset | common.Asset): EnhancedAsset {
    return Object.assign(new EnhancedAsset(), asset).normalize();
  }

  private formatAttributes(attrs: any): any {
    let formatted: Array<string> = [];
    for (let attr in attrs) {
      formatted.push(`${attr}:${attrs[attr]}`);
    }
    return formatted.join(',');
  }

  private formatDurationParametersFor(enhancedAsset: EnhancedAsset): object {
    return { startSecond: enhancedAsset.inMarkerFrame.asSeconds(0), endSecond: enhancedAsset.outMarkerFrame.asSeconds(0) };
  }
}
