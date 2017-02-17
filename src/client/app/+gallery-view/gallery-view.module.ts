import { NgModule } from '@angular/core';
import { GalleryViewComponent } from './gallery-view.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [GalleryViewComponent],
  exports: [GalleryViewComponent]
})
export class GalleryViewModule { }
