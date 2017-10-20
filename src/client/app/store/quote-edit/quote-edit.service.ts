import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Quote } from '../../shared/interfaces/commerce.interface';
import { FutureApiService } from '../api/api.service';
import { Api, ApiParameters } from '../../shared/interfaces/api.interface';
import { SubclipMarkers, Duration, durationFrom, bothMarkersAreSet } from '../../shared/interfaces/subclip-markers';
import { AssetLineItem, Asset, QuoteOptions } from '../../shared/interfaces/commerce.interface';
import { Pojo, SelectedPriceAttributes } from '../../shared/interfaces/common.interface';

@Injectable()
export class FutureQuoteEditService {
  constructor(private apiService: FutureApiService) { }


  public load(): Observable<Quote> {
    return this.apiService.get(Api.Orders, 'quote/focused', { loadingIndicator: true });
  }

  public delete(quoteId: number): Observable<Quote> {
    return this.apiService.delete(Api.Orders, `quote/${quoteId}`, { loadingIndicator: 'onBeforeRequest' })
      .switchMap(() => this.load());
  }

  public editLineItem(quoteId: number, lineItem: AssetLineItem, markers: SubclipMarkers, attributes: Pojo): Observable<Quote> {
    const duration: Duration = this.durationFrom(lineItem, markers);
    const newAttributes: SelectedPriceAttributes[] = attributes ? this.format(attributes) : lineItem.attributes || [];
    const newAsset: Asset = { ...lineItem.asset, ...duration };

    const newLineItem = {
      ...lineItem,
      attributes: newAttributes,
      asset: newAsset
    };

    return this.makeEditLineItemRequest(quoteId, newLineItem);
  }

  public removeAsset(quoteId: number, asset: Asset): Observable<Quote> {
    return this.apiService.delete(Api.Orders, `quote/${quoteId}/asset/${asset.uuid}`, { loadingIndicator: true });
  }

  public addCustomPriceToLineItem(quoteId: number, lineItem: AssetLineItem, customPrice: number): Observable<Quote> {
    const multiplier: number = Math.round((customPrice / lineItem.itemPrice) * Math.pow(10, 6)) / Math.pow(10, 6);

    const newLineItem: AssetLineItem = {
      ...lineItem,
      multiplier: multiplier
    };

    return this.makeEditLineItemRequest(quoteId, newLineItem);
  }

  public sendQuote(quoteId: number, options: QuoteOptions): Observable<any> {
    if (options.purchaseType === 'Standard') delete options.purchaseType;
    return this.apiService.put(
      Api.Orders,
      `quote/send/${quoteId}`,
      { parameters: options as ApiParameters, loadingIndicator: true }
    );
  }

  private durationFrom(lineItem: AssetLineItem, markers: SubclipMarkers): Duration {
    return bothMarkersAreSet(markers) ?
      durationFrom(markers) : { timeStart: lineItem.asset.timeStart, timeEnd: lineItem.asset.timeEnd };
  }

  private makeEditLineItemRequest(quoteId: number, lineItem: AssetLineItem): Observable<Quote> {
    return this.apiService.put(
      Api.Orders,
      `quote/${quoteId}/update/lineItem/${lineItem.id}`,
      { body: lineItem, parameters: { region: 'AAA' }, loadingIndicator: true }
    );
  }

  private format(newAttributes: Pojo): SelectedPriceAttributes[] {
    let formatted: Array<any> = [];
    for (let attr in newAttributes) {
      formatted.push({ priceAttributeName: attr, selectedAttributeValue: newAttributes[attr] });
    }
    return formatted;
  }
}
