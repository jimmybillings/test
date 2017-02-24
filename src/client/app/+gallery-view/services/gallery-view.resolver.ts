import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GalleryViewService } from './gallery-view.service';
import { GalleryViewUrlifier } from './gallery-view-urlifier';
import { Gallery, GalleryPath } from '../gallery-view.interface';

@Injectable()
export class GalleryViewResolver {
  constructor(private galleryViewService: GalleryViewService) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<Gallery> {
    return this.galleryViewService.load(GalleryViewUrlifier.unurlify(route.params['names'], route.params['ids']));
  }
}
