import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { GalleryViewService } from './services/gallery-view.service';
import { GalleryBreadcrumb } from './gallery-view.interface';

@Component({
  moduleId: module.id,
  selector: 'gallery-view-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'gallery-view.html'
})
export class GalleryViewComponent implements OnInit {
  public data: Observable<any>;

  constructor(private galleryViewService: GalleryViewService) { }

  public ngOnInit(): void {
    this.data = this.galleryViewService.data;
    this.galleryViewService.initialize();
  }

  public labelFor(breadcrumb: GalleryBreadcrumb): string {
    return breadcrumb && breadcrumb.names ? breadcrumb.names.join(' > ') : '';
  }

  public onClickBreadcrumb(index: number): void {
    this.galleryViewService.jumpTo(index);
  }

  public onNavigate(event: any): void {
    if (event.method === 'nextLevel') {
      this.galleryViewService.select(event.breadcrumb);
    } else {
      this.galleryViewService.search(event.breadcrumb);
    }
  }
}
