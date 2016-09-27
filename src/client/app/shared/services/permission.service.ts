import { Injectable } from '@angular/core';
import { CurrentUser } from './current-user.model';
/**
 * Model that describes current user, and provides  
 * methods for retrieving user attributes.
 */

// const availablePermissions: any = ['Root', 'ViewClips'];

@Injectable()
export class UserPermission {

  public permissions: any;

  constructor(private currentUser: CurrentUser) {
    this.currentUser.profile.map(user => {
      if (user.permissions) {
        return user.permissions || [];
      } else if (user.roles) {
        return user.roles[0].permissions || [];
      } else {
        return [];
      }
    }).subscribe(permissions => {
      this.permissions = permissions;
    });
  }

  public has(permission: any): boolean {
    return this.permissions.indexOf(permission) > -1 || this.permissions.indexOf('Root') > -1;
  }
}
