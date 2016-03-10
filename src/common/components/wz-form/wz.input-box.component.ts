import {Component, Input} from 'angular2/core';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { FORM_DIRECTIVES, FORM_PROVIDERS, ControlContainer } from 'angular2/common';

/**
 * Home page component - renders the home page
 */  
@Component({
  selector: 'wz-input-box',
  templateUrl: 'common/components/wz-form/wz.input-box.html',
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES],
  providers: [FORM_PROVIDERS, ControlContainer],
})

export class WzInputBox {
  @Input() item;
  @Input() control;
    
  // constructor() {
  // }
  
}
