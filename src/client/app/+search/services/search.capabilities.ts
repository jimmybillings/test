import { Injectable } from '@angular/core';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiState } from '../../shared/services/ui.state';


@Injectable()
export class SearchCapabilities {
  constructor(public currentUser: CurrentUser, public uiState: UiState) { }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
