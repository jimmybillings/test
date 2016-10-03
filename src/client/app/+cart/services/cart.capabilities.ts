import { Injectable } from '@angular/core';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Observable } from 'rxjs/Rx';
import { UiState } from '../../shared/services/ui.state';

@Injectable()
export class CartCapabilities {
  constructor(public currentUser: CurrentUser, public uiState: UiState) { }

  public viewCart(): boolean {
    return this.currentUser.loggedIn() && this.userHas('ViewCarts');
  }

  public viewCartIcon(): Observable<boolean> {
    return this.uiState.searchBarIsActive().map((searchBarIsActive) => {
      return searchBarIsActive && this.userHas('ViewCarts');
    });
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
