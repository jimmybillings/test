import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from 'angular2/core';
import { WzForm } from '../wz-form/wz.form.component';

@Component({
  selector: 'filter',
  templateUrl: 'components/filter/filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [WzForm]
})

export class Filter {
  @Input() fields;
  @Output() filterSubmit = new EventEmitter();
  @Output() clearFilter = new EventEmitter();
  
  public onSubmit(formValues: any): void {
    this.filterSubmit.emit(formValues);
  }
  
  public clearFilters(event: any): void {
    this.clearFilter.emit(event);
  }
}
