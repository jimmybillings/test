import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { FutureApiService } from '../api/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import {
  DeliveryOption,
  ApiDeliveryOptions,
  DeliveryOptions,
  DeliveryOptionGroup
} from '../../shared/interfaces/asset.interface';


@Injectable()
export class DeliveryOptionsService {
  constructor(private apiService: FutureApiService) { }

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
}
