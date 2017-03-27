import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { TranslateModule } from 'ng2-translate';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WzFormComponent } from './wz.form.component';
import { WzCcFormComponent } from './wz.cc.form.component';
import { WzInputTagsComponent } from './components/wz-input-tags/wz-input-tags.component';
import { WzInputSuggestionsComponent } from './components/wz-input-suggestions/wz-input-suggestions.component';
import { WzAutocompleteSearchComponent } from './components/wz-autocomplete-search/wz-autocomplete-search.component';
import { EqualValidatorDirective } from './wz-validators/wz-equal-validator.directive';
import { WzPikaDayDirective } from './components/wz-pikaday/wz-pikaday.directive';
import { FormModel } from './wz.form.model';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    WzFormComponent,
    WzCcFormComponent,
    WzInputTagsComponent,
    WzInputSuggestionsComponent,
    EqualValidatorDirective,
    WzPikaDayDirective,
    WzAutocompleteSearchComponent
  ],
  exports: [
    WzFormComponent,
    WzCcFormComponent,
    WzPikaDayDirective,
    WzAutocompleteSearchComponent
  ],
  providers: [FormModel]
})
export class WzFormModule { }
