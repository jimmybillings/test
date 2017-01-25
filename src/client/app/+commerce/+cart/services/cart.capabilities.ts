import { Injectable } from '@angular/core';
import { CurrentUser } from '../../../shared/services/current-user.model';
import { Observable } from 'rxjs/Rx';
import { UiState } from '../../../shared/services/ui.state';
import { FeatureStore } from '../../../shared/stores/feature.store';
import { Feature } from '../../../shared/interfaces/feature.interface';

@Injectable()
export class CartCapabilities {
  constructor(public currentUser: CurrentUser, public uiState: UiState, public feature: FeatureStore) { }

  public accessCart(): boolean {
    return this.feature.access(Feature.cart);
  }

  public viewCartIcon(): Observable<boolean> {
    return this.uiState.headerIsExpanded().map((headerIsExpanded) => {
      return this.accessCart() && headerIsExpanded && this.addToCart();
    });
  }

  public addToCart(): boolean {
    return this.accessCart() && this.userHas('ViewCarts');
  }

  public purchaseOnCredit(): boolean {
    return this.currentUser.hasPurchaseOnCredit();
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
