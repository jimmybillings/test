import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { ApiService } from './api.service';
import { Api } from '../interfaces/api.interface';
import { Observable } from 'rxjs/Rx';

const initCartSummary: any = {
  'projects': [
    {
      'name': 'Project A',
      'projectId': '',
      'itemCount': 0,
      'subtotal': 0
    }
  ],
  'itemCount': 0,
  'total': 0
};

export const cartSummary: ActionReducer<any> = (state: any = initCartSummary, action: Action) => {
  switch (action.type) {
    case 'CART_SUMMARY.UPDATE_SUMMARY':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class CartSummaryService {
  public data: Observable<any>;

  constructor(private api: ApiService, private store: Store<any>) {
    this.data = this.store.select('cartSummary');
  }

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(cartSummary => state = cartSummary);
    return state;
  }

  public loadCartSummary(): void {
    this.getCartSummary();
  }

  public addAssetToProjectInCart(asset: any): void {
    this.api.put2(
      Api.Orders,
      'cart/asset/lineItem/quick',
      { body: this.formatAsset(asset), parameters: { projectName: this.lastProjectName, region: 'AAA' } }
    ).subscribe(data => this.updateCartSummaryStore(data));
  }

  private getCartSummary(): void {
    this.api.get2(Api.Orders, 'cart/summary')
      .subscribe(data => this.updateCartSummaryStore(data));
  }

  private updateCartSummaryStore(cartSummary: any): void {
    this.store.dispatch({ type: 'CART_SUMMARY.UPDATE_SUMMARY', payload: cartSummary });
  }

  private get lastProjectName(): string {
    return this.state.projects[this.state.projects.length - 1].name;
  }

  private formatAsset(asset: any): any {
    return {
      lineItem: {
        asset: {
          assetId: asset.assetId
        }
      }
    };
  }
}
