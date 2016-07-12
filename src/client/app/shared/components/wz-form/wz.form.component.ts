import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder}    from '@angular/forms';
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

export class WzFormComponent implements OnInit {
  @Input() items: any;
  @Input() submitLabel: string;
  @Output() formSubmit = new EventEmitter();

  public form: FormGroup;

  constructor(public fb: FormBuilder, private formModel: FormModel) {}

  ngOnInit() {
    this.form = this.fb.group(this.formModel.create(this.items));
  }

  public parseOptions(options: any) {
    return options.split(',');
  }


  public radioSelect(field: any, option: any) {
    (<FormControl>this.form.controls[field]).updateValue(option);
  }

  public onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
      // this.resetForm();
    } else {
      console.log('error');
    }
  }

  public resetForm() {
    this.formModel.updateForm(this.form, {});
    this.formModel.markFormAsUntouched(this.form);
  }
}
