import { NgModule } from '@angular/core';

import { GalleryViewComponent } from './gallery-view.component';
import { OneLevelViewComponent } from './components/one-level-view.component';
import { TwoLevelViewComponent } from './components/two-level-view.component';
import { GalleryViewService } from './services/gallery-view.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [
    GalleryViewComponent,
    OneLevelViewComponent,
    TwoLevelViewComponent
  ],
  providers: [GalleryViewService],
  exports: [GalleryViewComponent]
})
export class GalleryViewModule { }
