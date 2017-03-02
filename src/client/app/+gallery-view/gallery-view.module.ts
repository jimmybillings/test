import { NgModule } from '@angular/core';

import { GalleryViewComponent } from './gallery-view.component';
import { OneLevelViewComponent } from './components/one-level-view.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [
    GalleryViewComponent,
    OneLevelViewComponent
  ],
  exports: [GalleryViewComponent]
})
export class GalleryViewModule { }
