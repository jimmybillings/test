import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FutureApiService } from '../api/api.service';
import { Api, ApiOptions } from '../../shared/interfaces/api.interface';
import * as Common from '../../shared/interfaces/common.interface';
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

  public createShareLink(shareLink: Common.Pojo): Observable<any> {
    return this.apiService.post(Api.Identities, 'accessInfo', { body: shareLink });
  }

  public getClipPreviewData(assetId: number): Observable<any> {
    const viewType: ApiOptions = { parameters: { 'useType': 'clipPreview' } };
    return this.apiService.get(Api.Assets, `renditionType/${assetId}`, viewType);
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
