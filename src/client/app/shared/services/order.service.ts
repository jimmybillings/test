import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../services/api.service';
import { Api } from '../interfaces/api.interface';
import { OrderStore } from '../stores/order.store';
import { enhanceAsset } from '../interfaces/enhanced-asset';
import {
  Project,
  Order,
  AssetLineItem
} from '../interfaces/commerce.interface';

@Injectable()
export class OrderService {
  constructor(private api: ApiService, private store: OrderStore) { }

  public get data(): Observable<Order> {
    return this.store.data;
  }

  public get projects(): Observable<Project[]> {
    return this.data.map((data: Order) => {
      return data.projects.map((project: Project) => {
        if (project.lineItems) {
          project.lineItems = project.lineItems.map((lineItem: AssetLineItem) => {
            lineItem.asset = enhanceAsset(lineItem.asset, 'orderAsset');
            return lineItem;
          });
        }
        return project;
      });
    });
  }

  public getOrder(orderId: number): Observable<any> {
    return this.api.get(Api.Orders, `order/${orderId}`)
      .do(response => this.store.update(response));
  }
}
