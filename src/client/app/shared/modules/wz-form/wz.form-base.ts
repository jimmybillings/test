import { Input, Output, EventEmitter, OnInit, OnChanges, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl } from '@angular/forms';
import { FormModel } from './wz.form.model';
import { FormFields, ServerErrors } from '../../../shared/interfaces/forms.interface';

export class WzFormBase implements OnInit, OnChanges {
  @Input() items: FormFields[];
  @Input() serverErrors: ServerErrors;
  @Input() submitLabel: string = 'Submit';
  @Input() includeCancel: boolean = false;
  @Input() cancelLabel: string = 'Cancel';
  @Input() autocomplete: string = 'on';
  @Output() formSubmit = new EventEmitter();
  @Output() formCancel = new EventEmitter();
  @Output() onAction = new EventEmitter();
  @Output() cacheSuggestions = new EventEmitter();
  public submitAttempt: boolean = false;
  public showRequiredLegend: boolean = false;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private formModel: FormModel,
    private element: ElementRef) { }

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
        if (control.toLowerCase() === error.field.toLowerCase()) {
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

  public markFieldsAsDirty() {
    for (let control in this.form.controls) {
      (<FormControl>this.form.controls[control]).markAsDirty();
    }
  }

  public parseOptions(options: any) {
    return options.split(',');
  }

  public radioSelect(fieldName: string, option: any) {
    this.update(fieldName, option);
  }

  public updateDateValueFor(fieldName: string, dateString: string) {
    this.update(fieldName, this.calculateDateFor(dateString));
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
      field.validation === 'TERMS' ||
      field.validation === 'COLLECTION') ? true : false;
  }

  public hasErrorType(field: FormControl | AbstractControl): boolean {
    return (!field.valid && field.pristine && this.submitAttempt) ||
      (!field.valid && !field.pristine && this.submitAttempt) ||
      (!field.valid && !field.pristine && !this.submitAttempt);
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
    this.markFieldsAsDirty();
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      console.log(this.form);
    }
  }

  public resetForm() {
    this.element.nativeElement.children[0].reset();
    this.submitAttempt = false;
    this.formModel.updateForm(this.form, {});
    this.formModel.markFormAsUntouched(this.form);
  }

  public calculateDateFor(dateSpec: string): string {
    if (!dateSpec) return null;

    const upperDateSpec = dateSpec.toUpperCase().replace(/ /g, '');

    if (upperDateSpec === 'TODAY') return this.dateToString(new Date());

    if (upperDateSpec.match(/^TODAY[+-][0-9]+$/)) {
      const numberOfDaysToAdd: number = parseInt(upperDateSpec.replace('TODAY', ''));
      const date: Date = new Date();
      date.setDate(date.getDate() + numberOfDaysToAdd);

      return this.dateToString(date);
    }

    let date: Date;

    try {
      date = new Date(dateSpec);
    } catch (error) {
      throw new Error(`Could not parse date specification '${dateSpec}'`);
    }

    return this.dateToString(date);
  }

  private dateToString(date: Date): string {
    return date.toISOString().slice(0, 10).replace(/-/g, '/');
  }

  private update(fieldName: string, value: any) {
    (<FormControl>this.form.controls[fieldName]).setValue(value);
  }
}
