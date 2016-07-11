import { Injectable }             from '@angular/core';
import { CanActivate, Router }    from '@angular/router';
import { UserPermission } from '../../shared/services/permission.service';
import { CurrentUser } from '../../shared/services/current-user.model';

@Injectable()
export class AssetGuard implements CanActivate {
  constructor(
    private currentUser: CurrentUser,
    private permission: UserPermission,
    private router: Router) { }

  canActivate() {
    return (this.canView()) ? true : this.router.navigate(['/user/login']) && false;
  }

  private canView() {
    return this.currentUser.loggedIn() && (this.permission.has('Root') || this.permission.has('ViewClips'));
  }

}


