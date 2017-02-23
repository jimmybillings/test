import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GalleryViewService } from './gallery-view.service';

@Injectable()
export class GalleryViewResolver {
  constructor(private galleryViewService: GalleryViewService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const pathParameter: string = route.params['path'];

    return this.galleryViewService.load(pathParameter ? JSON.parse(pathParameter) : []);
  }
}
