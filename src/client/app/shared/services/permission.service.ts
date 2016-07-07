import { Injectable } from '@angular/core';
import { CurrentUser } from './current-user.model';
import { Store} from '@ngrx/store';

/**
 * Model that describes current user, and provides  
 * methods for retrieving user attributes.
 */

const permissionMap: any = {
  'root': 'Root'
};

@Injectable()
export class UserPermission extends CurrentUser {
  public permissions: any;

  constructor(store: Store<any>) {
    super(store);
    this.profile.map(user => {
      return (user) ? user.permissions || [] : {permissions: []};
    }).subscribe(permissions => {
      this.permissions = permissions;
    });
  }

  public has(permission:any): boolean {
    return this.permissions.indexOf(permissionMap[permission]) > -1;
  }

}
