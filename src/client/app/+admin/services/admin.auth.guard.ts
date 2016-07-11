import { Injectable }             from '@angular/core';
import { CanActivate,Router }    from '@angular/router';
import { UserPermission } from '../../shared/services/permission.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private permission: UserPermission, private router: Router) { }

  canActivate() {
    return (this.permission.has('Root')) ? true : this.router.navigate(['/']) && false;
  }
}


