import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { CartCapabilities } from '../../+commerce/+cart/services/cart.capabilities';
import { AssetCapabilities } from '../../+asset/services/asset.capabilities';
import { AdminCapabilities } from '../../+admin/services/admin.capabilities';
import { CollectionCapabilities } from '../../+collection/services/collection.capabilities';
import { SearchCapabilities } from '../../+search/services/search.capabilities';
import { CurrentUserService } from './current-user.service';
import { UiState } from '../services/ui.state';
import { FeatureStore } from '../stores/feature.store';

@Injectable()
export class Capabilities implements CartCapabilities, CollectionCapabilities, AssetCapabilities, AdminCapabilities, SearchCapabilities {
  haveCollections: () => boolean;
  viewCollections: () => boolean;
  editCollections: () => boolean;
  viewAssetDetails: () => boolean;
  viewDownloadCompOptions: (hasComp: boolean) => boolean;
  downloadWatermarkComps: (hasComp: boolean) => boolean;
  downloadCleanComps: (hasComp: boolean) => boolean;
  downloadFullComps: (hasComp: boolean) => boolean;
  createAccessInfo: () => boolean;
  createSubclips: () => boolean;
  viewAdmin: () => boolean;
  viewCollectionTray: () => Observable<boolean>;
  viewSearchBar: () => Observable<boolean>;
  viewCartIcon: () => Observable<boolean>;
  purchaseOnCredit: () => boolean;
  addToCart: () => boolean;
  accessCart: () => boolean;
  haveCart: () => boolean;
  editAddress: () => boolean;
  addAddress: () => boolean;
  editAccountAddress: () => boolean;
  addAccountAddress: () => boolean;
  findMetadataValueFor: (metadataName: string, object: any) => string | null;

  constructor(
    public currentUser: CurrentUserService,
    public route: Router,
    public uiState: UiState,
    public feature: FeatureStore) {
    this.applyMixins(Capabilities, [
      CartCapabilities,
      CollectionCapabilities,
      AssetCapabilities,
      AdminCapabilities,
      SearchCapabilities
    ]);
  }

  public viewAll() {
    return this.userHas('Root');
  }

  public default() {
    return this.currentUser.loggedIn();
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }

  private applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
    });
  }

}




