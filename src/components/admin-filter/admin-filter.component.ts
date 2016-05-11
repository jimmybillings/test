import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from 'angular2/core';
import { WzForm } from '../wz-form/wz.form.component';

@Component({
  selector: 'filter',
  templateUrl: 'components/admin-filter/admin-filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [WzForm]
})

export class AdminFilter {
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
