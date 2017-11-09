import { Component, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormModel } from './wz.form.model';
import { WzFormBase } from './wz.form-base';
/**
 * Home page component - renders the home page
 */
@Component({
  moduleId: module.id,
  selector: 'wz-form-picklist-component',
  templateUrl: 'wz-form-picklist.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzFormPicklistComponent extends WzFormBase {


  constructor(
    fb: FormBuilder,
    formModel: FormModel,
    element: ElementRef) {
    super(fb, formModel, element);
  }

}
