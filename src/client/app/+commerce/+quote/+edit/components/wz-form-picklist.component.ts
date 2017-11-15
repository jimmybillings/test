import { BehaviorSubject } from 'rxjs/Rx';
import { Pojo } from '../../../../shared/interfaces/common.interface';
import { Component, ChangeDetectionStrategy, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormModel } from '../../../../shared/modules/wz-form/wz.form.model';
import { WzFormBase } from '../../../../shared/modules/wz-form/wz.form-base';
/**
 * Home page component - renders the home page
 */
@Component({
  moduleId: module.id,
  selector: 'wz-form-picklist-component',
  templateUrl: 'wz-form-picklist.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzFormPicklistComponent extends WzFormBase {
  public labels: BehaviorSubject<Pojo[]> = new BehaviorSubject([]);
  @Input() title: string;
  @Input()
  set displayProperties(properties: string[]) {
    const tempLabels: Pojo[] = Object.keys(properties || [])
      .filter(property => property !== 'field' && property !== 'id' && property !== 'name')
      .map((property: string) => {
        let label: string = property.replace(/([A-Z])/g, function (str) { return `_${str.toLowerCase()}`; });
        label = `QUOTE.EDIT.${label.toUpperCase()}_KEY`;
        return { label: label, value: properties[property as any] };
      });
    this.labels.next(tempLabels);
  }
  @Output() selectContact: EventEmitter<Pojo> = new EventEmitter();

  constructor(
    fb: FormBuilder,
    formModel: FormModel,
    element: ElementRef) {
    super(fb, formModel, element);
  }

  public onSelectChange(suggestion: Pojo) {
    this.selectContact.emit(suggestion);
  }

}
