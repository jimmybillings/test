import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Gallery, GalleryResult, GalleryNavigationEvent } from '../gallery-view.interface';

@Component({
  moduleId: module.id,
  selector: 'two-level-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'two-level-view.html'
})
export class TwoLevelViewComponent {
  @Input() public data: Gallery;
  @Output() public navigate: EventEmitter<GalleryNavigationEvent> = new EventEmitter<GalleryNavigationEvent>();

  public onClick(result: GalleryResult, child: GalleryResult) {
    this.navigate.emit({
      pathSegment: { ids: [result.id, child.id], names: [result.name, child.name] },
      method: child.hasChildren ? 'nextLevel' : 'search'
    });
  }
}
