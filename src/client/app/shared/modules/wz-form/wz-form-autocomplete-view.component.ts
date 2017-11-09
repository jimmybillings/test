import { Subject } from 'rxjs/Rx';
import { Pojo } from '../../interfaces/common.interface';
import { Component, ChangeDetectionStrategy, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FormModel } from './wz.form.model';
import { FormFields, ServerErrors } from '../../../shared/interfaces/forms.interface';
import { WzFormBase } from './wz.form-base';
/**
 * Home page component - renders the home page
 */
@Component({
  moduleId: module.id,
  selector: 'wz-form-autocomplete-view',
  templateUrl: 'wz-form-autocomplete-view.html',
  styles: [
    `:host {
      height: 200px;
      background: white;
      padding: 20px;
    }
    :host ul {
      list-style-type:none;
      padding:0;
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzFormAutoCompleteViewComponent extends WzFormBase {
  public labels: Subject<Pojo[]> = new Subject();
  @Input() matchOnProperty: string;
  @Input()
  set displayProperties(properties: string[]) {
    const tempLabels: Pojo[] = Object.keys(properties || [])
      .filter(property => property !== 'field' && property !== 'id' && property !== 'email')
      .map((property: string) => {
        let label: string = property.replace(/([A-Z])/g, ' $1')
          .replace(/^./, function (str) { return str.toUpperCase(); });
        return { label: label, value: properties[property as any] };
      });
    this.labels.next(tempLabels);
  }

  constructor(
    fb: FormBuilder,
    formModel: FormModel,
    element: ElementRef) {
    super(fb, formModel, element);
  }

  public onSelectSuggestion(suggestion: Pojo) {
    if (suggestion) this.formSubmit.emit(suggestion);
  }
}
