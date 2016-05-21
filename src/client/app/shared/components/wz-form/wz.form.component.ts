import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit} from '@angular/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder, Control } from '@angular/common';
import {FormModel} from './wz.form.model';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

/**
 * Home page component - renders the home page
 */
@Component({
  selector: 'wz-form',
  templateUrl: 'app/shared/components/wz-form/wz.form.html',
  directives: [
    FORM_DIRECTIVES
  ],
  providers: [FormModel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [TranslatePipe]
})

export class WzFormComponent implements OnInit {
  @Input() items: any;
  @Input() submitLabel: string;
  @Output() formSubmit = new EventEmitter();

  public form: ControlGroup;

  constructor(public fb: FormBuilder, private formModel: FormModel) { }

  ngOnInit() {
    this.form = this.fb.group(this.formModel.create(this.items));
  }

  public parseOptions(options: any) {
    return options.split(',');
  }


  public radioSelect(field: any, option: any) {
    (<Control>this.form.controls[field]).updateValue(option);
  }

  public onSubmit(data: any) {
    (this.form.valid) ? this.formSubmit.emit(data) : console.log('error');
  }
}
