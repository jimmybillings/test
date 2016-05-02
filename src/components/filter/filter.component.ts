import { Component, Input, ChangeDetectionStrategy } from 'angular2/core';
import { WzForm } from '../wz-form/wz.form.component';

@Component({
  selector: 'filter',
  templateUrl: 'components/filter/filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [WzForm]
})

export class Filter {
  @Input() fields;
  
  public onSubmit(): void {
    console.log('emit an event and call a method in index that hits the service');
  }
}
