import { Injectable } from '@angular/core';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiState } from '../../shared/services/ui.state';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CollectionCapabilities {
  constructor(public currentUser: CurrentUser, public uiState: UiState) { }

  public viewCollections() {
    return this.currentUser.loggedIn() && this.userHas('ViewCollections');
  }

  public viewCollectionTray(): Observable<boolean> {
    return this.uiState.searchBarIsActive().map((searchBarIsActive) => {
      return searchBarIsActive && this.userHas('ViewCollections');
    });
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
