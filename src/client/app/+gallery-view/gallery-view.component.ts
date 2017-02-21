import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { GalleryViewService } from './services/gallery-view.service';

@Component({
  moduleId: module.id,
  selector: 'gallery-view-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'gallery-view.html'
})
export class GalleryViewComponent implements OnInit {
  public data: Observable<any>;
  public numberOfLevels: number = 0;

  constructor(private galleryViewService: GalleryViewService) { }

  public ngOnInit(): void {
    this.data = this.galleryViewService.data;
    this.loadViewZero();
  }

  public loadViewZero(): void {
    this.numberOfLevels = 2;
    this.galleryViewService.loadZero();
  }

  public onNavigate(event: any): void {
    if (event.method === 'nextLevel') {
      this.numberOfLevels = 1;
      this.galleryViewService.loadTwo();
    } else {
      this.galleryViewService.search(event.params);
    }
  }
}
