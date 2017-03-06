import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeHeroComponent } from './components/home-hero.component';
import { HomeHighlightsComponent } from './components/home-highlights.component';
import { HomeVendorMarqueeComponent } from './components/home-vendor-marquee.component';
import { HomeCallToActionComponent } from './components/home-call-to-action.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    HomeComponent,
    HomeHeroComponent,
    HomeHighlightsComponent,
    HomeVendorMarqueeComponent,
    HomeCallToActionComponent],
  exports: [HomeComponent],
})

export class HomeModule { }
