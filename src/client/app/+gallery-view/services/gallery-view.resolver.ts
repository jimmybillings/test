import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GalleryViewService } from './gallery-view.service';
import { Gallery, GalleryPath } from '../gallery-view.interface';

@Injectable()
export class GalleryViewResolver {
  constructor(private galleryViewService: GalleryViewService) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<Gallery> {
    const pathParameter: string = route.params['path'];

    return this.galleryViewService.load(pathParameter ? JSON.parse(pathParameter) : []);
  }
}
