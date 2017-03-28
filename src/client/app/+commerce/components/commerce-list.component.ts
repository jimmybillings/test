import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'commerce-list',
  templateUrl: 'commerce-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommerceListComponent {
  @Input() items: any;
  @Input() type: 'ORDER' | 'QUOTE';
}
