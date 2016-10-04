import { Injectable } from '@angular/core';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiState } from '../../shared/services/ui.state';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CollectionCapabilities {
  constructor(public currentUser: CurrentUser, public uiState: UiState) { }

  public viewCollections() {
    return this.userHas('ViewCollections');
  }

  public editCollections() {
    return this.userHas('EditCollections');
  }

  public viewCollectionTray(): Observable<boolean> {
    return this.uiState.headerIsExpanded().map((headerIsExpanded) => {
      return headerIsExpanded && this.userHas('ViewCollections');
    });
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
