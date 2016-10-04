import { Injectable } from '@angular/core';
import { CartCapabilities } from '../../+cart/services/cart.capabilities';
import { AssetCapabilities } from '../../+asset/services/asset.capabilities';
import { AdminCapabilities } from '../../+admin/services/admin.capabilities';
import { CollectionCapabilities } from '../../+collection/services/collection.capabilities';
import { SearchCapabilities } from '../../+search/services/search.capabilities';
import { CurrentUser } from './current-user.model';
import { Router } from '@angular/router';
import { UiState } from '../../shared/services/ui.state';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class Capabilities implements CartCapabilities, CollectionCapabilities, AssetCapabilities, AdminCapabilities, SearchCapabilities {
  viewCollections: () => boolean;
  editCollections: () => boolean;
  viewAssetDetails: () => boolean;
  viewDownloadCompOptions: (hasComp: boolean) => boolean;
  downloadWatermarkComps: (hasComp: boolean) => boolean;
  downloadCleanComps: (hasComp: boolean) => boolean;
  downloadFullComps: (hasComp: boolean) => boolean;
  createAccessInfo: () => boolean;
  viewAdmin: () => boolean;
  viewCollectionTray: () => Observable<boolean>;
  viewSearchBar: () => Observable<boolean>;
  viewCartIcon: () => Observable<boolean>;

  constructor(
    public currentUser: CurrentUser,
    public route: Router,
    public uiState: UiState) {
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
    if (this.currentUser.hasPermission('Root')) return true;
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




