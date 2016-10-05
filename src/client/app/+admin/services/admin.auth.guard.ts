import { Injectable }             from '@angular/core';
import { CanActivate }    from '@angular/router';
import { Capabilities } from '../../shared/services/capabilities.service';
import { ErrorActions } from '../../shared/services/error.service';
import { CurrentUser } from '../../shared/services/current-user.model';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private userCan: Capabilities, private error: ErrorActions, private currentUser: CurrentUser) { }

  canActivate() {
    if(this.userCan.viewAdmin()) {
      return true;
    } else if (!this.currentUser.loggedIn()) {
      this.error.handle({ status: 401 });
      return false;
    } else {
      this.error.handle({ status: 403 });
      return false;
    }
  }
}
