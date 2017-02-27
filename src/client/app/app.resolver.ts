import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiConfig } from './shared/services/api.config';
import { UiConfig } from './shared/services/ui.config';
import { CurrentUserService } from './shared/services/current-user.service';
declare var portal: string;

@Injectable()
export class AppResolver {
  constructor(
    private apiConfig: ApiConfig,
    private uiConfig: UiConfig) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.uiConfig.initialize(portal);
  }
}
