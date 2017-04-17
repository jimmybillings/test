import { Injectable } from '@angular/core';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { Observable } from 'rxjs/Observable';
import { UiState } from '../../shared/services/ui.state';
import { FeatureStore } from '../../shared/stores/feature.store';
import { Feature } from '../../shared/interfaces/feature.interface';
import { Address, ViewAddress } from '../../shared/interfaces/user.interface';

@Injectable()
export class CommerceCapabilities {
  constructor(public currentUser: CurrentUserService, public uiState: UiState, public feature: FeatureStore) { }

  public haveCart(): boolean {
    return this.feature.isAvailable(Feature.disableCartAccess);
  }

  public viewCartIcon(): Observable<boolean> {
    return this.uiState.headerIsExpanded().map((headerIsExpanded) => {
      return this.haveCart() && headerIsExpanded && this.addToCart();
    });
  }

  public addToCart(): boolean {
    return this.haveCart() && this.currentUser.loggedIn();
  }

  public purchaseOnCredit(): boolean {
    return this.haveCart() && this.currentUser.hasPurchaseOnCredit();
  }

  public editAddress(address: ViewAddress): boolean {
    return address.type === 'user' && !!address.address;
  }

  public addAddress(address: ViewAddress): boolean {
    return address.type === 'user' && !address.address;
  }

  public editAccountAddress(address: ViewAddress): boolean {
    return address.type === 'account' && this.userHas('EditAccounts') && !!address.address;
  }

  public addAccountAddress(address: ViewAddress): boolean {
    return address.type === 'account' && this.userHas('EditAccounts') && !address.address;
  }

  public administerQuotes(): boolean {
    return this.userHas('AdministerQuotes');
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }

  public createSubclips(asset: any): boolean {
    return this.userHas('CreateSubclips') && typeof this.findMetadataValueFor('Format.FrameRate', asset) === 'string';
  }

  public findMetadataValueFor(metadataName: string, object: any): string | null {
    if (object !== Object(object)) return null;

    const keys = Object.keys(object);

    if (keys.length === 2 && keys.sort().join('|') === 'name|value' && object.name === metadataName) {
      return object.value;
    }

    for (var key of keys) {
      const value = this.findMetadataValueFor(metadataName, object[key]);
      if (value) return value;
    }

    return null;
  }
}
