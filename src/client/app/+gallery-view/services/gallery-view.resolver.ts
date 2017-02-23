import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GalleryViewService } from './gallery-view.service';
import { GalleryBreadcrumb } from '../gallery-view.interface';

@Injectable()
export class GalleryViewResolver {
  constructor(private galleryViewService: GalleryViewService) { }
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.galleryViewService.load(this.unstringify(route.params));
  }

  private unstringify(parameters: any): GalleryBreadcrumb[] {
    const namesParameter: string = parameters.names;
    const idsParameter: string = parameters.ids;

    if (!namesParameter || !idsParameter) return [];

    const names: string[][] = namesParameter.replace(/\._\./g, ' ').split('~~~').map(name => name.split('~~'));
    const ids: number[][] = idsParameter.split('~~~').map(idString => idString.split('~~').map(idString => parseInt(idString)));

    return names.map((namesSubarray, index) => { return { names: namesSubarray, ids: ids[index] } });
  }
}
