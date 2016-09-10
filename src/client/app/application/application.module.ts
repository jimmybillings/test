import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AppNavComponent } from './app-nav/app-nav.component';
import { CollectionTrayComponent } from './collection-tray/collection-tray.component';
import { FooterComponent } from './footer/footer.component';
import { CollectionListDdComponent } from './collection-tray/components/collections-list-dd.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    AppNavComponent,
    CollectionTrayComponent,
    FooterComponent,
    CollectionListDdComponent],
  exports: [AppNavComponent, CollectionTrayComponent, FooterComponent]
})

export class ApplicationModule { }
