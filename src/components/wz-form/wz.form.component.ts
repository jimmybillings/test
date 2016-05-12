import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {NgFor} from 'angular2/common';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder, Control } from 'angular2/common';
import {FormModel} from './wz.form.model';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

/**
 * Home page component - renders the home page
 */
@Component({
  selector: 'wz-form',
  templateUrl: 'components/wz-form/wz.form.html',
  directives: [NgFor, MATERIAL_DIRECTIVES, FORM_DIRECTIVES],
  providers: [FormModel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [TranslatePipe]
})

export class WzForm {
  @Input() items;
  @Input() submitLabel: string;
  @Output() formSubmit = new EventEmitter();

  public form: ControlGroup;
    
  constructor(public fb: FormBuilder, private formModel: FormModel) {}
  
  ngOnInit() {
    this.form = this.fb.group(this.formModel.create(this.items));
  }

  public parseOptions(options) {
    return options.split(',');
  }

  public radioSelect(field, option) {
    (<Control>this.form.controls[field]).updateValue(option);
  }
  
  public onSubmit(data:any) {
    (this.form.valid) ? this.formSubmit.emit(data) : console.log('error');
  }
}
