import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { EnhancedAsset } from '../interfaces/enhanced-asset';
import { PriceAttribute } from '../interfaces/commerce.interface';
import { Api, ApiParameters } from '../interfaces/api.interface';
import * as SubclipMarkersInterface from '../interfaces/subclip-markers';

@Injectable()
export class PricingService {
  constructor(private apiService: ApiService) { }

  public getPriceFor(asset: EnhancedAsset, attributes: any, markers?: SubclipMarkersInterface.SubclipMarkers): Observable<any> {
    const parameters: ApiParameters =
      Object.assign(
        { region: 'AAA' },
        { attributes: this.formatAttributes(attributes) },
        markers ? this.formatDurationParametersFor(markers) : null
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

  private formatDurationParametersFor(markers: SubclipMarkersInterface.SubclipMarkers): object {
    return {
      startSecond: markers.in.asSeconds(3) * 1000, endSecond: markers.out.asSeconds(3) * 1000
    };
  }
}
