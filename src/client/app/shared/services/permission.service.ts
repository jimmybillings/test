import { Injectable } from '@angular/core';
import { CurrentUser } from './current-user.model';
/**
 * Model that describes current user, and provides
 * methods for retrieving user attributes.
 */

// const availablePermissions: any = ['Root', 'ViewClips'];

@Injectable()
export class UserPermission {

  public permissions: Array<string> = [];

  constructor(private currentUser: CurrentUser) {}

  public has(permission: any): boolean {
    return this.permissions.indexOf(permission) > -1 || this.permissions.indexOf('Root') > -1;
  }

  public retrievePermissions() {
    this.currentUser.profile.map(user => {
      if (user.permissions) {
        return user.permissions || [];
      } else if (user.roles) {
        return user.roles[0].permissions || [];
      } else {
        return [];
      }
    }).take(1).subscribe(permissions => {
      this.permissions = permissions;
    });
  }
}
