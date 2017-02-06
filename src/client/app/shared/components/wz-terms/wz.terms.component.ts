import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-terms',
  templateUrl: 'wz.terms.html'
})

export class WzTermsComponent {
  @Input() terms: any;
  @Input() dialog: any;
}
