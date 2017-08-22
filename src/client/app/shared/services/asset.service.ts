import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { ApiService } from '../../shared/services/api.service';
import { Api, ApiOptions, ApiParameters } from '../../shared/interfaces/api.interface';
import { PriceAttribute } from '../../shared/interfaces/commerce.interface';
import { CurrentUserService } from '../../shared/services/current-user.service';
import * as commerce from '../interfaces/commerce.interface';
import * as common from '../interfaces/common.interface';
import { EnhancedAsset, enhanceAsset } from '../interfaces/enhanced-asset';

@Injectable()
export class AssetService {
  public errorMessage: any;

  constructor(private api: ApiService, private currentUser: CurrentUserService) { }

  public downloadComp(id: any, compType: any): Observable<any> {
    return this.api.get(Api.Assets, `renditionType/downloadUrl/${id}`, { parameters: { type: compType } });
  }

  // TODO:  Rewrite this a bit?  After creating getPriceFor(asset, attributes) below,
  // the only remaining use of this method is called from AssetComponent.
  // And duration is no longer used in this method.
  public getPrice(id: number, attributes?: any, duration?: { startSecond: number, endSecond: number }): Observable<any> {
    let formatedAttributes = attributes ? this.formatAttributes(attributes) : null;
    let parameters = formatedAttributes ? { region: 'AAA', attributes: formatedAttributes } : { region: 'AAA' };
    parameters = duration ? Object.assign(parameters, duration) : parameters;
    return this.api.get(Api.Orders, `priceBook/price/${id}`, { parameters }).map((data: any) => data.price);
  }

  public getPriceFor(asset: commerce.Asset, attributes?: any): Observable<any> {
    const enhancedAsset: EnhancedAsset = enhanceAsset(asset);
    const parameters: ApiParameters =
      Object.assign(
        { region: 'AAA' },
        attributes ? { attributes: this.formatAttributes(attributes) } : null,
        enhancedAsset.isSubclipped ? this.formatDurationParametersFor(enhancedAsset) : null
      );

    return this.api.get(Api.Orders, `priceBook/price/${asset.assetId}`, { parameters }).map((data: any) => data.price);
  }

  public createShareLink(shareLink: common.Pojo): Observable<any> {
    return this.api.post(Api.Identities, 'accessInfo', { body: shareLink });
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

  public getClipPreviewData(assetId: number): Observable<any> {
    const viewType: ApiOptions = { parameters: { 'useType': 'clipPreview' } };
    return this.api.get(Api.Assets, `renditionType/${assetId}`, viewType);
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
