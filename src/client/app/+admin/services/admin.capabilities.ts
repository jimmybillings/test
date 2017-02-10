import { Injectable } from '@angular/core';
import { CurrentUserService } from '../../shared/services/current-user.service';

@Injectable()
export class AdminCapabilities {
  constructor(public currentUser: CurrentUserService) { }

  public viewAdmin(): boolean {
    return this.userHas('Root');
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
