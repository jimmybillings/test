import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../shared/services/api.service';
import { Api, ApiOptions } from '../../shared/interfaces/api.interface';
import { Asset, AssetLoadParameters } from '../../shared/interfaces/common.interface';

@Injectable()
export class FutureAssetService {
  constructor(private apiService: ApiService) { }

  public load(parameters: AssetLoadParameters): Observable<Asset> {
    const options: ApiOptions = { loadingIndicator: true };
    if (parameters.share_key) options.overridingToken = parameters.share_key;

    return this.apiService.get(Api.Assets, `clip/${parameters.id}/clipDetail`, options)
      .map(response => this.merge(response as Asset, parameters));
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
