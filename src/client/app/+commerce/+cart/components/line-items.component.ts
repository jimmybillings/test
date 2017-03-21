import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LineItems } from '../../components/line-items';

@Component({
  moduleId: module.id,
  selector: 'line-items-component',
  templateUrl: './line-items.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineItemsComponent extends LineItems {
  constructor() {
    super();
  }
}
