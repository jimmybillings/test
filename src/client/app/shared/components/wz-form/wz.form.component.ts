import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges} from '@angular/core';
import { FormGroup, FormControl, FormBuilder} from '@angular/forms';
import { FormModel } from './wz.form.model';
import { FormFields } from '../../../shared/interfaces/forms.interface';


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
  @Input() items: any;
  @Input() submitLabel: string;
  @Input() autocomplete: string = 'on';
  @Output() formSubmit = new EventEmitter();
  public submitAttempt: boolean = false;
  public showRequiredLegend: boolean = false;
  public form: FormGroup;

  constructor(private fb: FormBuilder, private formModel: FormModel) { }

  ngOnChanges(changes: any) {
    if (changes.items.currentValue && this.form) {
      // console.log(this.form.controls);
      for (let control in this.form.controls) {
        changes.items.currentValue.forEach((field: any) => {
          if (control === field.name)
            (<FormControl>this.form.controls[control]).updateValue(field.value);
        });
      }
    }
  }

  ngOnInit() {
    this.form = this.fb.group(this.formModel.create(this.items));
    this.showRequiredLegend = this.hasRequiredFields(this.items);
    // console.log(this.form);
  }

  public parseOptions(options: any) {
    return options.split(',');
  }

  public radioSelect(field: any, option: any) {
    (<FormControl>this.form.controls[field]).updateValue(option);
  }

  public onSubmit() {
    this.submitAttempt = true;
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
      // this.resetForm();
    } else {
      console.log('error');
      console.log(this.form);
    }
  }

  public resetForm() {
    this.submitAttempt = false;
    this.formModel.updateForm(this.form, {});
    this.formModel.markFormAsUntouched(this.form);
  }

  /**
   * simple check if a given field has a required validation rule or not
   * @param field is a form field control.
   */
  public isRequiredField(field: FormFields): boolean {
    return 'validation' in field && (
      field.validation === 'REQUIRED' ||
      field.validation === 'EMAIL' ||
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
}
