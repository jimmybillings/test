import { Injectable } from '@angular/core';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { UiState } from '../../shared/services/ui.state';


@Injectable()
export class SearchCapabilities {
  constructor(public currentUser: CurrentUserService, public uiState: UiState) { }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
