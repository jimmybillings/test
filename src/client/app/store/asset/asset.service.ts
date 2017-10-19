import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FutureApiService } from '../api/api.service';
import { Api, ApiOptions } from '../../shared/interfaces/api.interface';
import * as common from '../../shared/interfaces/common.interface';
import {
  DeliveryOption,
  ApiDeliveryOptions,
  DeliveryOptions,
  DeliveryOptionGroup
} from '../../shared/interfaces/asset.interface';
import { Asset, AssetLoadParameters } from '../../shared/interfaces/common.interface';

@Injectable()
export class AssetService {
  constructor(private apiService: FutureApiService) { }

  public load(parameters: AssetLoadParameters): Observable<Asset> {
    const options: ApiOptions = { loadingIndicator: true };
    if (parameters.share_key) options.overridingToken = parameters.share_key;

    return this.apiService.get(Api.Assets, `clip/${parameters.id}/clipDetail`, options)
      .map(asset => this.merge(asset, parameters));
  }

  public downloadComp(id: any, compType: any): Observable<any> {
    return this.apiService.get(Api.Assets, `renditionType/downloadUrl/${id}`, { parameters: { type: compType } });
  }

  public createShareLink(shareLink: common.Pojo): Observable<any> {
    return this.apiService.post(Api.Identities, 'accessInfo', { body: shareLink });
  }

  public getClipPreviewData(assetId: number): Observable<any> {
    const viewType: ApiOptions = { parameters: { 'useType': 'clipPreview' } };
    return this.apiService.get(Api.Assets, `renditionType/${assetId}`, viewType);
  }

  public getDeliveryOptions(assetId: number): Observable<DeliveryOptions> {
    return this.apiService.get(Api.Assets, `renditionType/deliveryOptions/${assetId}`).map(this.formatDeliveryOptions);
  }

  private formatDeliveryOptions(options: ApiDeliveryOptions): DeliveryOptions {
    if (!options.list) return [];
    let formattedOptions: DeliveryOptions = [];
    options.list.reduce((usedGroupIds: string[], option: DeliveryOption) => {
      let group: DeliveryOptionGroup;
      if (!option.deliveryOptionGroupId) {
        formattedOptions.push([option]);
      } else {
        const groupId: string = option.deliveryOptionGroupId;
        if (!usedGroupIds.includes(groupId)) {
          group = options.list
            .filter(o => o.deliveryOptionGroupId === groupId)
            .sort((a, b) => parseInt(a.deliveryOptionGroupOrder) - parseInt(b.deliveryOptionGroupOrder));
          formattedOptions.push(group);
          usedGroupIds.push(groupId);
        }
      }
      return usedGroupIds;
    }, []);
    return formattedOptions;
  }

  private merge(asset: Asset, parameters: AssetLoadParameters): Asset {
    return {
      ...asset,
      uuid: parameters.uuid || null,
      timeStart: this.convert(parameters.timeStart),
      timeEnd: this.convert(parameters.timeEnd)
    };
  }

  private convert(time: string): number {
    const number: number = parseInt(time);
    return number >= 0 ? number : null;
  }
}