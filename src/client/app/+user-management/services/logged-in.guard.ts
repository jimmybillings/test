import { Injectable }             from '@angular/core';
import { CanActivate, Router }    from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(
    private currentUser: CurrentUser,
    private router: Router) { }

  canActivate() {
    if (!this.currentUser.loggedIn())  {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
