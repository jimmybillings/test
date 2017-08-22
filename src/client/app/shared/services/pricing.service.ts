import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { EnhancedAsset } from '../interfaces/enhanced-asset';
import { PriceAttribute } from '../interfaces/commerce.interface';
import { Api, ApiParameters } from '../interfaces/api.interface';
import { SubclipMarkers, Duration, durationFrom } from '../interfaces/subclip-markers.interface';
import * as commerce from '../interfaces/commerce.interface';
import * as common from '../interfaces/common.interface';

@Injectable()
export class PricingService {
  constructor(private apiService: ApiService) { }

  public getPriceFor(asset: commerce.Asset, markers: SubclipMarkers, attributes?: any): Observable<any> {
    const duration: Duration = durationFrom(markers);
    const assetWithDuration: commerce.Asset = {
      ...JSON.parse(JSON.stringify(asset)),
      timeStart: duration.timeStart,
      timeEnd: duration.timeEnd
    };
    const enhancedAsset: EnhancedAsset = this.enhance(assetWithDuration);
    const parameters: ApiParameters =
      Object.assign(
        { region: 'AAA' },
        attributes ? { attributes: this.formatAttributes(attributes) } : null,
        enhancedAsset.isSubclipped ? this.formatDurationParametersFor(enhancedAsset) : null
      );

    return this.apiService.get(Api.Orders, `priceBook/price/${asset.assetId}`, { parameters }).map((data: any) => data.price);
  }

  public getPriceAttributes(priceModel?: string): Observable<Array<PriceAttribute>> {
    priceModel = priceModel ? priceModel.split(' ').join('') : 'RightsManaged';
    return this.apiService.get(
      Api.Orders,
      'priceBook/priceAttributes',
      { parameters: { region: 'AAA', priceModel: priceModel } }
    ).map((data: any) => {
      data.list[0].primary = true;
      return data.list;
    });
  }

  private formatAttributes(attrs: any): any {
    let formatted: Array<string> = [];
    for (let attr in attrs) {
      formatted.push(`${attr}:${attrs[attr]}`);
    }
    return formatted.join(',');
  }

  private formatDurationParametersFor(enhancedAsset: EnhancedAsset): object {
    return {
      startSecond: enhancedAsset.inMarkerFrame.asSeconds(3) * 1000, endSecond: enhancedAsset.outMarkerFrame.asSeconds(3) * 1000
    };
  }

  private enhance(asset: commerce.Asset | common.Asset): EnhancedAsset {
    return Object.assign(new EnhancedAsset(), asset).normalize();
  }
}
