import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Pojo } from '../../../../shared/interfaces/common.interface';
import { Component, ChangeDetectionStrategy, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormModel } from '../../../../shared/modules/wz-form/wz.form.model';
import { WzFormBase } from '../../../../shared/modules/wz-form/wz.form-base';

@Component({
  moduleId: module.id,
  selector: 'wz-form-picklist-component',
  templateUrl: 'wz-form-picklist.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzFormPicklistComponent extends WzFormBase {
  public labels: BehaviorSubject<Pojo[]>;
  public propertiesToIgnore: string[] = ['contacts', 'name', 'id'];
  @Input() title: string;
  @Input()
  set displayProperties(properties: Pojo) {
    const tempLabels: Pojo[] = Object.keys(properties || [])
      .filter((property: string) => !this.propertiesToIgnore.includes(property))
      .map((property: string) => {
        let label: string = property.replace(/([A-Z])/g, function (str) { return `_${str.toLowerCase()}`; });
        label = `QUOTE.EDIT.${label.toUpperCase()}_KEY`;
        return { label: label, value: properties[property as any] };
      });
    this.labels = new BehaviorSubject(tempLabels);
  }
  @Output() selectContact: EventEmitter<Pojo> = new EventEmitter();

  constructor(fb: FormBuilder, formModel: FormModel, element: ElementRef) {
    super(fb, formModel, element);
  }

  public onSelectChange(suggestion: Pojo) {
    this.selectContact.emit(suggestion);
  }
}
