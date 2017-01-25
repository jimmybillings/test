import { Injectable } from '@angular/core';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiState } from '../../shared/services/ui.state';
import { FeatureStore } from '../../shared/stores/feature.store';
import { Feature } from '../../shared/interfaces/feature.interface';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CollectionCapabilities {
  constructor(public currentUser: CurrentUser, public uiState: UiState, public feature: FeatureStore) { }

  public haveCollections(): boolean {
    return this.feature.isAvailable(Feature.disableCollectionAccess);
  }

  public viewCollections(): boolean {
    return this.haveCollections() && this.userHas('ViewCollections');
  }

  public editCollections(): boolean {
    return this.haveCollections() && this.userHas('EditCollections');
  }

  public viewCollectionTray(): Observable<boolean> {
    return this.uiState.headerIsExpanded().map((headerIsExpanded) => {
      return this.haveCollections() && headerIsExpanded && this.userHas('ViewCollections');
    });
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
