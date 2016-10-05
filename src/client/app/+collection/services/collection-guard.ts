import { Injectable }             from '@angular/core';
import { CanActivate, Router }    from '@angular/router';
import { Capabilities } from '../../shared/services/capabilities.service';
import { CurrentUser } from '../../shared/services/current-user.model';
import { ErrorActions } from '../../shared/services/error.service';

@Injectable()
export class CollectionGuard implements CanActivate {
  constructor(
    private userCan: Capabilities,
    private currentUser: CurrentUser,
    private router: Router,
    private error: ErrorActions) { }

  canActivate() {
    if (this.currentUser.loggedIn() && this.userCan.viewCollections()) {
      return true;
    } else {
      if (this.currentUser.loggedIn() && !this.userCan.viewCollections()) {
          this.error.handle({status: 403});
      } else {
        this.error.handle({status: 401});
      }
      return false;
    }
  }

}


