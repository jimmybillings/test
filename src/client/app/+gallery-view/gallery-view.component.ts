import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private galleryViewService: GalleryViewService, private router: Router) { }

  public ngOnInit(): void {
    this.data = this.galleryViewService.data;
  }

  public labelFor(breadcrumb: GalleryBreadcrumb): string {
    return breadcrumb && breadcrumb.names ? breadcrumb.names.join(' : ') : '';
  }

  public onClickBreadcrumb(index: number): void {
    let breadcrumbs = JSON.parse(JSON.stringify(this.galleryViewService.state.breadcrumbs));
    breadcrumbs = breadcrumbs.slice(0, index);

    this.changeRouteFor(breadcrumbs);
  }

  public onNavigate(event: any): void {
    const breadcrumbs = JSON.parse(JSON.stringify(this.galleryViewService.state.breadcrumbs));
    breadcrumbs.push(event.breadcrumb);

    if (event.method === 'nextLevel') {
      this.changeRouteFor(breadcrumbs);
    } else {
      alert(`TO BE IMPLEMENTED\n\nWould have run a search with:\n\n   ${this.stringifyBreadcrumbsForSearch(breadcrumbs)}`);
    }
  }

  private changeRouteFor(breadcrumbs: GalleryBreadcrumb[]): void {
    this.router.navigate(
      breadcrumbs.length === 0
        ? ['/gallery-view']
        : ['/gallery-view', this.stringifyNamesForRouting(breadcrumbs), this.stringifyIdsForRouting(breadcrumbs)]
    );
  }

  private stringifyNamesForRouting(breadcrumbs: GalleryBreadcrumb[]): string {
    return breadcrumbs
      .map((breadcrumb: GalleryBreadcrumb) => breadcrumb.names.map(name => name.replace(/ /g, '._.')).join('~~'))
      .join('~~~');
  }

  private stringifyIdsForRouting(breadcrumbs: GalleryBreadcrumb[]): string {
    return breadcrumbs
      .map((breadcrumb: GalleryBreadcrumb) => breadcrumb.ids.join('~~'))
      .join('~~~');
  }

  private stringifyBreadcrumbsForSearch(breadcrumbs: GalleryBreadcrumb[]): string {
    return breadcrumbs.map((breadcrumb: GalleryBreadcrumb) => this.stringifyBreadcrumbForSearch(breadcrumb)).join(',');
  }

  private stringifyBreadcrumbForSearch(breadcrumb: GalleryBreadcrumb): string {
    return breadcrumb.ids.map((id: number, index: number) => `${id}:"${breadcrumb.names[index]}"`).join(',');
  }
}
