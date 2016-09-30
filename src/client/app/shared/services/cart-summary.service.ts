import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams, RequestOptions } from '@angular/http';

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


  public getCartSummary(): void {
    this.api.get('api/orders/v1/cart/summary').map(res => {
      return res.json();
    }).take(1).subscribe(data => {
      this.updateCartSummaryStore(data);
    });
  }

  public addAssetToProjectInCart(asset: any): void {
    let projectName: string = this.lastProjectName;
    let body: any = this.formatAsset(asset);
    let options: RequestOptions = this.buildSearchOptions({ 'projectName': projectName, 'region': 'AAA' });
    this.api.put('api/orders/v1/cart/asset/lineItem', JSON.stringify(body), options)
      .map(res => { return res.json(); })
      .take(1).subscribe(data => this.updateCartSummaryStore(data));
  }

  public updateCartSummary(itemCount: number, projectId?: string): void {
    if (projectId) this.removeProjectFromCartSummary(projectId);

  }

  private removeProjectFromCartSummary(projectId: string): void {
    this.data.map((cartSummary: any) => {
      console.log(cartSummary);
    });
  }

  private updateCartSummaryStore(cartSummary: any): void {
    this.store.dispatch({ type: 'CART_SUMMARY.UPDATE_SUMMARY', payload: cartSummary });
  }

  private get lastProjectName(): string {
    let name: string;
    this.data.map((summary: any) => {
      summary.projects.forEach((project: any, i: number) => {
        name = (i === summary.projects.length - 1) ? project.name : null;
      });
    }).take(1).subscribe();
    return name;
  }

  private formatAsset(asset: any): any {
    return {
      'lineItem': {
        'asset': {
          'assetId': asset.assetId
        }
      }
    };
  }

  private buildSearchOptions(queryObject: any): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in queryObject) search.set(param, queryObject[param]);
    let options = this.buildRequestOptions(search);
    return new RequestOptions(options);
  }

  private buildRequestOptions(search?: URLSearchParams): RequestOptions {
    return search ? new RequestOptions({ search }) : new RequestOptions({});
  }
}
