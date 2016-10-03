import { Injectable }             from '@angular/core';
import { CanActivate,Router }    from '@angular/router';
import { Capabilities } from '../../shared/services/capabilities.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private userCan: Capabilities, private router: Router) { }

  canActivate() {
    return (this.userCan.viewAdmin()) ? true : this.router.navigate(['/']) && false;
  }
}


