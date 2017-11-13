import { Subject } from 'rxjs/Rx';
import { Pojo } from '../../interfaces/common.interface';
import { Component, ChangeDetectionStrategy, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormModel } from './wz.form.model';
import { WzFormBase } from './wz.form-base';
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
  public labels: Subject<Pojo[]> = new Subject();
  @Input() title: string;
  @Input()
  set displayProperties(properties: string[]) {
    const tempLabels: Pojo[] = Object.keys(properties || [])
      .filter(property => property !== 'field')
      .map((property: string) => {
        let label: string = property.replace(/([A-Z])/g, ' $1')
          .replace(/^./, function (str) { return str.toUpperCase(); });
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
