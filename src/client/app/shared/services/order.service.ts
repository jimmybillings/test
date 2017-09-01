import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../services/api.service';
import { Api } from '../interfaces/api.interface';
import { AppStore } from '../../app.store';
import { enhanceAsset } from '../interfaces/enhanced-asset';
import { Project, Order, AssetLineItem } from '../interfaces/commerce.interface';

@Injectable()
export class OrderService {
  constructor(private api: ApiService, private store: AppStore) { }

  public get data(): Observable<Order> {
    return this.store.select(state => state.order.activeOrder);
  }

  public get projects(): Observable<Project[]> {
    return this.data.map((data: Order) => {
      return data.projects.map((project: Project) => {
        if (project.lineItems) {
          project.lineItems = project.lineItems.map((lineItem: AssetLineItem) => {
            lineItem.asset = enhanceAsset(
              Object.assign(lineItem.asset, { uuid: lineItem.id }),
              { type: 'orderAsset', parentId: data.id }
            );
            return lineItem;
          });
        }
        return project;
      });
    });
  }
}
