import { Injectable }             from '@angular/core';
import { CanActivate, Router }    from '@angular/router';
import { Capabilities } from '../../shared/services/capabilities.service';
import { CurrentUser } from '../../shared/services/current-user.model';

@Injectable()
export class CollectionGuard implements CanActivate {
  constructor(
    private userCan: Capabilities,
    private currentUser: CurrentUser,
    private router: Router) { }

  canActivate() {
    if (this.currentUser.loggedIn() && this.userCan.viewCollections()) {
      return true;
    } else {
      if (this.currentUser.loggedIn() && !this.userCan.viewCollections()) {
          this.router.navigate(['/user/profile', {'permission': 'required'}]);
      } else {
        this.router.navigate(['/user/login', {'requireLogin': 'true'}]);
      }
      return false;
    }
  }

}


