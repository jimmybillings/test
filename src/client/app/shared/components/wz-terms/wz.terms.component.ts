import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-terms',
  templateUrl: 'wz.terms.html'
})

export class WzTermsComponent {
  @Input() terms: any;
  @Output() close: any = new EventEmitter();

  public agreeToTerms(): void {
    let agreeCheckbox = <HTMLFormElement>document.querySelector('.md-checkbox-layout');
    if (agreeCheckbox) agreeCheckbox.click();
    this.close.emit();
  }
}