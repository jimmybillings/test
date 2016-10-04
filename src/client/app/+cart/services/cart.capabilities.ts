import { Injectable } from '@angular/core';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Observable } from 'rxjs/Rx';
import { UiState } from '../../shared/services/ui.state';

@Injectable()
export class CartCapabilities {
  constructor(public currentUser: CurrentUser, public uiState: UiState) { }

  public viewCartIcon(): Observable<boolean> {
    return this.uiState.headerIsExpanded().map((headerIsExpanded) => {
      return headerIsExpanded && this.currentUser.loggedIn();
    });
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
