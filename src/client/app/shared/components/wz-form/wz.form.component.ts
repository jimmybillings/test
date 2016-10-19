import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FormModel } from './wz.form.model';
import { FormFields, ServerErrors } from '../../../shared/interfaces/forms.interface';
import { ApiConfig } from '../../services/api.config';

/**
 * Home page component - renders the home page
 */
@Component({
  moduleId: module.id,
  selector: 'wz-form',
  templateUrl: 'wz.form.html',
  providers: [FormModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzFormComponent implements OnInit, OnChanges {
  @Input() items: FormFields[];
  @Input() serverErrors: ServerErrors;
  @Input() submitLabel: string;
  @Input() includeCancel: boolean = false;
  @Input() cancelLabel: string = 'Cancel';
  @Input() autocomplete: string = 'on';
  @Output() formSubmit = new EventEmitter();
  @Output() formCancel = new EventEmitter();
  public submitAttempt: boolean = false;
  public showRequiredLegend: boolean = false;
  public form: FormGroup;

  constructor(private fb: FormBuilder, private formModel: FormModel, private apiConfig: ApiConfig) { }

  ngOnChanges(changes: any) {
    if (changes.serverErrors && this.form) this.mergeErrors();
    if (changes.items && this.form) this.mergeNewValues();
  }

  ngOnInit() {
    this.form = this.fb.group(this.formModel.create(this.items));
  }

  public mergeErrors() {
    this.serverErrors.fieldErrors.forEach((error) => {
      for (let control in this.form.controls) {
        if (control === error.field) {
          (<FormControl>this.form.controls[control]).setErrors({ serverError: error.code });
        }
      }
    });
  }

  public mergeNewValues() {
    this.items.forEach((field: any) => {
      for (let control in this.form.controls) {
        if (control === field.name) {
          (<FormControl>this.form.controls[control]).patchValue(field.value);
        }
      }
    });
  }

  public parseOptions(options: any) {
    return options.split(',');
  }

  public radioSelect(field: any, option: any) {
    (<FormControl>this.form.controls[field]).setValue(option);
  }

  /**
   * simple check if a given field has a required validation rule or not
   * @param field is a form field control.
   */
  public isRequiredField(field: FormFields): boolean {
    return 'validation' in field && (
      field.validation === 'REQUIRED' ||
      field.validation === 'EMAIL' ||
      field.validation === 'MULTIEMAIL' ||
      field.validation === 'PASSWORD' ||
      field.validation === 'COLLECTION') ? true : false;
  }

  /**
   * boolean flag used in the ui to draw '*indicates required field'
   * we filter through the form fields checking validation. It's true when at least 1 field is required
   * @param formFields is an array of form fields.
   */
  public hasRequiredFields(formFields: FormFields[]): boolean {
    let req = formFields.filter(this.isRequiredField);
    return req.length > 0 ? true : false;
  }

  public onSubmit() {
    this.submitAttempt = true;
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      console.log('error');
    }
  }

  public resetForm() {
    this.submitAttempt = false;
    this.formModel.updateForm(this.form, {});
    this.formModel.markFormAsUntouched(this.form);
  }
}
