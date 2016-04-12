import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {NgFor} from 'angular2/common';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from 'angular2/common';
import {Form} from './wz.form.model';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

/**
 * Home page component - renders the home page
 */  
@Component({
  selector: 'wz-form',
  templateUrl: 'components/wz-form/wz.form.html',
  directives: [NgFor, MATERIAL_DIRECTIVES, FORM_DIRECTIVES],
  providers: [Form],
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [TranslatePipe]
})

export class WzForm {
  @Input() items;
  @Input() submitLabel: string;
  @Output() formSubmit = new EventEmitter();
  
  public form: ControlGroup;
    
  constructor(public fb: FormBuilder, private _form: Form) {}
  
  ngOnInit(): void {
    this.form = this.fb.group(this._form.create(this.items));
  }
  
  public parseOptions(options) {
    return options.split(',');
  }
  
  public onSubmit(data:any): void {
    // console.log(this.form);
    if (this.form.valid) {
      this.formSubmit.emit(data);
      // call callback in parent component
    } else {
      console.log('error');
      // failed on the server so Show errors
    }
  }
}
