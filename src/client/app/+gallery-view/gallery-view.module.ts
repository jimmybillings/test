import { NgModule } from '@angular/core';

import { GalleryViewComponent } from './gallery-view.component';
import { OneLevelViewComponent } from './components/one-level-view.component';
import { GalleryViewService } from './services/gallery-view.service';
import { GalleryViewStore } from './services/gallery-view.store';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [
    GalleryViewComponent,
    OneLevelViewComponent
  ],
  providers: [GalleryViewService, GalleryViewStore],
  exports: [GalleryViewComponent]
})
export class GalleryViewModule { }
