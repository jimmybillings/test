import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges} from '@angular/core';
import {FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {FormModel} from './wz.form.model';
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
  public submitted: boolean = false;
  public formHasRequiredFields: boolean = false;
  public form: FormGroup;

  constructor(private fb: FormBuilder, private formModel: FormModel) { }

  ngOnChanges(changes: any) {
    if (changes.items.currentValue && this.form) {
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
    this.formHasRequiredFields = this.hasRequiredFields(this.items);
  }

  public parseOptions(options: any) {
    return options.split(',');
  }

  public radioSelect(field: any, option: any) {
    (<FormControl>this.form.controls[field]).updateValue(option);
  }

  public onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
      // this.resetForm();
    } else {
      console.log('error');
      // console.log(this.form);
    }
  }

  public resetForm() {
    this.submitted = false;
    this.formModel.updateForm(this.form, {});
    this.formModel.markFormAsUntouched(this.form);
  }
  public checkForRequiredFields(field:FormFields): boolean {
    if ('validation' in field && (field.validation === 'REQUIRED' || field.validation === 'EMAIL' || field.validation === 'PASSWORD')) {
      return true;
    } else {
      return false;
    }
  }

  public hasRequiredFields(field:FormFields): boolean {
    let req = this.items.filter(this.checkForRequiredFields);
    if (req.length > 1) {
      return true;
    } else {
      return false;
    }
  }

  public isRequired(fieldValidator: string): boolean {
    if (fieldValidator === 'REQUIRED' || fieldValidator === 'EMAIL' || fieldValidator === 'PASSWORD') {
      this.formHasRequiredFields = true;
      return true;
    } else {
      return false;
    }
  }
}
