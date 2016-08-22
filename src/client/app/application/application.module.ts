import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AppNavComponent } from './app-nav/app-nav.component';
import { BinTrayComponent } from './bin-tray/bin-tray.component';
import { FooterComponent } from './footer/footer.component';
import { CollectionListDdComponent } from './bin-tray/components/collections-list-dd.component';
import { CollectionFormComponent } from './bin-tray/components/collection-form.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    AppNavComponent,
    BinTrayComponent,
    FooterComponent,
    CollectionListDdComponent,
    CollectionFormComponent],
  exports: [AppNavComponent, BinTrayComponent, FooterComponent]
})

export class ApplicationModule { }
