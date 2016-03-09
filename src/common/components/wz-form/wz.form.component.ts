import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {NgFor} from 'angular2/common';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from 'angular2/common';
import {Valid} from '../../../common/services/validator.form.service';

/**
 * Home page component - renders the home page
 */  
@Component({
  selector: 'wz-form',
  templateUrl: 'common/components/wz-form/wz.form.html',
  directives: [NgFor, MATERIAL_DIRECTIVES, FORM_DIRECTIVES]
})

export class WzForm {
  @Input() items;
  @Output() onSubmit = new EventEmitter();
  
  public form: ControlGroup;
    
  constructor(
    public fb: FormBuilder,
    private _valid: Valid) {
  }
  
  ngOnInit(): void {
    this.form = this.fb.group(this._valid.createForm(this.items));
  }
  
  public submit(data:any): void {
    // console.log(this.form);
    if (this.form.valid) {
      this.onSubmit.emit(data);
      // call callback in parent component
    } else {
      console.log('error');
      // failed on the server so Show errors
    }
  }
}
