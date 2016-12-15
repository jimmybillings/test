import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-pricing',
  templateUrl: 'wz.pricing.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzPricingComponent {
  public form: any = {
    'Project Type': '',
    'Distribution': '',
    'Use': '',
    'Territory': '',
    'Term': '',
    'Price Format': ''
  };
  @Input() options: any;
  @Output() commitPricing: EventEmitter<any> = new EventEmitter();

  public onSubmit(): void {
    this.commitPricing.emit(this.form);
  }

  public parentIsEmpty(option: any): boolean {
    // find the parent of the current option and 
    return false;
  }
}