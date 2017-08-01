import { Injectable } from '@angular/core';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { UiState } from '../../shared/services/ui.state';
import { FeatureStore } from '../../shared/stores/feature.store';
import { Feature } from '../../shared/interfaces/feature.interface';
import { Collection } from '../../shared/interfaces/collection.interface';
import { User } from '../../shared/interfaces/user.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CollectionCapabilities {
  constructor(public currentUser: CurrentUserService, public uiState: UiState, public feature: FeatureStore) { }

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

  public editCollection(collection: Collection): Observable<boolean> {
    return this.currentUser.data.map((user: User) => {
      return user.id === collection.owner || (!!collection.editors && collection.editors.includes(user.id));
    });
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
