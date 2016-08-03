import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges} from '@angular/core';
import {FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {FormModel} from './wz.form.model';

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
  }

  public parseOptions(options: any) {
    return options.split(',');
  }


  public radioSelect(field: any, option: any) {
    (<FormControl>this.form.controls[field]).updateValue(option);
  }

  public onSubmit(formData: Object, event: KeyboardEvent) {
    this.submitted = true;
    if (this.form.valid) {
      this.formSubmit.emit(formData);
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
}
