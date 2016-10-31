import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AdminService } from './admin.service';

@Injectable()
export class AdminIndexResolver implements Resolve<any> {
  constructor(private adminService: AdminService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let resource: string = route.url[1].path;
    let params: any = route.params;
    return this.adminService.getResourceIndex(params, resource);
  }
}
