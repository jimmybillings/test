import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GalleryViewService } from './services/gallery-view.service';
import { GalleryViewUrlifier } from './services/gallery-view-urlifier';
import { GalleryPath, GalleryPathSegment } from './gallery-view.interface';

@Component({
  moduleId: module.id,
  selector: 'gallery-view-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'gallery-view.html'
})
export class GalleryViewComponent implements OnInit {
  public data: Observable<any>;

  constructor(private galleryViewService: GalleryViewService, private router: Router) { }

  public ngOnInit(): void {
    this.data = this.galleryViewService.data;
  }

  public breadcrumbLabelFor(path: GalleryPathSegment): string {
    return (path && path.names) ? path.names.join(' : ') : '';
  }

  public onClickBreadcrumb(index: number): void {
    let path = JSON.parse(JSON.stringify(this.galleryViewService.state.path));
    path = path.slice(0, index);

    this.changeRouteFor(path);
  }

  public onNavigate(event: any): void {
    const path = JSON.parse(JSON.stringify(this.galleryViewService.state.path));
    path.push(event.pathSegment);

    if (event.method === 'nextLevel') {
      this.changeRouteFor(path);
    } else {
      alert(`TO BE IMPLEMENTED\n\nWould have run a search with:\n\n   ${this.stringifyPathForSearch(path)}`);
    }
  }

  private changeRouteFor(path: GalleryPath): void {
    this.router.navigate(['/gallery-view'].concat(GalleryViewUrlifier.urlify(path)));
  }

  private stringifyPathForSearch(path: GalleryPath): string {
    return path.map((segment: GalleryPathSegment) => this.stringifyPathSegmentForSearch(segment)).join(',');
  }

  private stringifyPathSegmentForSearch(segment: GalleryPathSegment): string {
    return segment.ids.map((id: number, index: number) => `${id}:"${segment.names[index]}"`).join(',');
  }
}
