import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-terms',
  templateUrl: 'wz.terms.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzTermsComponent {
  @Input() terms: any;
  @Input() dialog: any;
}
