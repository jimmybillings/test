import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { UiConfig } from '../../shared/services/ui.config';

import { GalleryViewService } from '../../+gallery-view/services/gallery-view.service';


@Injectable()
export class HomeResolver implements Resolve<any> {
  public config: any;
  private configSubscription: Subscription;

  constructor(
    public currentUser: CurrentUserService,
    private uiConfig: UiConfig,
    private galleryViewService: GalleryViewService) {

    this.configSubscription = this.uiConfig.get('home').subscribe((config) => {
      this.config = config.config;
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (this.currentUser.loggedIn() && this.config.galleryView) {
      return this.galleryViewService.load([]);
    } else {
      return Observable.of(true);
    }
  }
}
