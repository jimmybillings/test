import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SearchContext } from '../shared/services/search-context.service';
import { GalleryViewService } from './services/gallery-view.service';
import { Gallery, GalleryPath, GalleryPathSegment, GalleryNavigationEvent } from './gallery-view.interface';

@Component({
  moduleId: module.id,
  selector: 'gallery-view-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'gallery-view.html'
})
export class GalleryViewComponent implements OnInit {
  public data: Observable<Gallery>;

  constructor(private galleryViewService: GalleryViewService, private router: Router, private search: SearchContext) { }

  public ngOnInit(): void {
    this.data = this.galleryViewService.data;
  }

  public onClickBreadcrumb(index: number): void {
    let path: GalleryPath = JSON.parse(JSON.stringify(this.galleryViewService.state.path));
    path = path.slice(0, index);

    this.changeRouteFor(path);
  }

  public onNavigate(event: GalleryNavigationEvent): void {
    const path = JSON.parse(JSON.stringify(this.galleryViewService.state.path));
    path.push(event.pathSegment);

    if (event.method === 'nextLevel') {
      this.changeRouteFor(path);
    } else {
      this.search.new({ gq: this.galleryViewService.stringifyPathForSearch(path), n: 100, i: 1 });
    }
  }

  private changeRouteFor(path: GalleryPath): void {
    const route: any[] = ['/gallery-view'];
    if (path && path.length > 0) route.push({ path: JSON.stringify(path) });

    this.router.navigate(route);
  }
}
