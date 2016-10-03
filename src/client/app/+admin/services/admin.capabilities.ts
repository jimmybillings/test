import { Injectable } from '@angular/core';
import { CurrentUser } from '../../shared/services/current-user.model';

@Injectable()
export class AdminCapabilities {
  constructor(public currentUser: CurrentUser) { }

  public viewAdmin(): boolean {
    return this.userHas('Root');
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
