import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../shared/services/api.service';
import { FutureApiService } from '../api/api.service';
import { Api, ApiOptions } from '../../shared/interfaces/api.interface';
import * as Common from '../../shared/interfaces/common.interface';
import { Asset, AssetLoadParameters } from '../../shared/interfaces/common.interface';
import * as SubclipMarkers from '../../shared/interfaces/subclip-markers';
import { CurrentUserService } from '../../shared/services/current-user.service';

@Injectable()
export class AssetService {
  constructor(private apiService: FutureApiService) { }

  public load(parameters: AssetLoadParameters): Observable<Asset> {
    const options: ApiOptions = { loadingIndicator: true };
    if (parameters.share_key) options.overridingToken = parameters.share_key;

    return this.apiService.get(Api.Assets, `clip/${parameters.id}/clipDetail`, options)
      .map(asset => this.merge(asset, parameters));
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

@Injectable()
export class LegacyAssetService {
  constructor(private apiService: ApiService, private currentUserService: CurrentUserService) { }

  public createShareLink(assetId: number, subclipMarkers: SubclipMarkers.SubclipMarkers, shareParameters: Common.Pojo = {}): Observable<any> {
    return this.apiService.post(
      Api.Identities, 'accessInfo', { body: this.backendify(assetId, subclipMarkers, shareParameters) }
    );
  }

  public getClipPreviewData(assetId: number): Observable<any> {
    const viewType: ApiOptions = { parameters: { 'useType': 'clipPreview' } };
    return this.apiService.get(Api.Assets, `renditionType/${assetId}`, viewType);
  }

  private backendify(
    assetId: number, subclipMarkers: SubclipMarkers.SubclipMarkers, shareParameters: Common.Pojo = {}
  ): Common.Pojo {
    const duration: SubclipMarkers.Duration = SubclipMarkers.durationFrom(subclipMarkers);
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);
    Object.assign(shareParameters, {
      accessEndDate: this.IsoFormatLocalDate(endDate),
      accessStartDate: this.IsoFormatLocalDate(new Date()),
      accessInfo: assetId,
      type: 'asset',
      recipientEmails: (shareParameters.recipientEmails) ?
        shareParameters.recipientEmails.split(/\s*,\s*|\s*;\s*/) : [],
      properties: {
        timeStart: duration.timeStart,
        timeEnd: duration.timeEnd
      }
    });

    if (shareParameters.copyMe) {
      shareParameters.recipientEmails.push(this.currentUserService.state.emailAddress);
    }

    return shareParameters;
  }

  // we need to submit date/timestamps in ISO format. This does that.
  private IsoFormatLocalDate(date: Date) {
    var d = date,
      tzo = -d.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num: any) {
        var norm = Math.abs(Math.floor(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return d.getFullYear()
      + '-' + pad(d.getMonth() + 1)
      + '-' + pad(d.getDate())
      + 'T' + pad(d.getHours())
      + ':' + pad(d.getMinutes())
      + ':' + pad(d.getSeconds())
      + dif + pad(tzo / 60)
      + ':' + pad(tzo % 60);
  }
}
