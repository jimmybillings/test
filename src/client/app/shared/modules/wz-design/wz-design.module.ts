import { NgModule, ModuleWithProviders } from '@angular/core';

import {
  MdRippleModule,
  RtlModule,
  ObserveContentModule,
  PortalModule,
  OverlayModule,
  A11yModule,
  CompatibilityModule,
} from '@angular/material';

import {
  MdButtonToggleModule,
  MdButtonModule,
  MdCheckboxModule,
  MdRadioModule,
  MdSelectModule,
  MdSlideToggleModule,
  MdSliderModule,
  MdSidenavModule,
  MdListModule,
  MdGridListModule,
  MdCardModule,
  MdChipsModule,
  MdIconModule,
  MdProgressSpinnerModule,
  MdProgressBarModule,
  MdInputModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  MdMenuModule,
  MdDialogModule,
  PlatformModule,
  MdAutocompleteModule,
  StyleModule
} from '@angular/material';

const MATERIAL_MODULES = [
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdChipsModule,
  MdCheckboxModule,
  MdDialogModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  OverlayModule,
  PortalModule,
  RtlModule,
  StyleModule,
  A11yModule,
  PlatformModule,
  CompatibilityModule,
  ObserveContentModule
];

/** @deprecated */
@NgModule({
  imports: [
    MdAutocompleteModule.forRoot(),
    MdButtonModule.forRoot(),
    MdCardModule.forRoot(),
    MdChipsModule.forRoot(),
    MdCheckboxModule.forRoot(),
    MdGridListModule.forRoot(),
    MdInputModule.forRoot(),
    MdListModule.forRoot(),
    MdProgressBarModule.forRoot(),
    MdProgressSpinnerModule.forRoot(),
    MdRippleModule.forRoot(),
    MdSelectModule.forRoot(),
    MdSidenavModule.forRoot(),
    MdTabsModule.forRoot(),
    MdToolbarModule.forRoot(),
    PortalModule.forRoot(),
    RtlModule.forRoot(),
    ObserveContentModule.forRoot(),

    // These modules include providers.
    A11yModule.forRoot(),
    MdButtonToggleModule.forRoot(),
    MdDialogModule.forRoot(),
    MdIconModule.forRoot(),
    MdMenuModule.forRoot(),
    MdRadioModule.forRoot(),
    MdSliderModule.forRoot(),
    MdSlideToggleModule.forRoot(),
    MdSnackBarModule.forRoot(),
    MdTooltipModule.forRoot(),
    PlatformModule.forRoot(),
    OverlayModule.forRoot(),
    CompatibilityModule.forRoot(),
  ],
  exports: MATERIAL_MODULES,
})
export class MaterialRootModule { }

/** @deprecated */
@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class MaterialModule {
  /** @deprecated */
  static forRoot(): ModuleWithProviders {
    return { ngModule: MaterialRootModule };
  }
}
