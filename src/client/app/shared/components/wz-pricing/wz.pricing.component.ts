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
    if (option.parent) {
      return false;
    } else {
      let parent: any = this.options.filter((o: any) => o.childId === option.id)[0];
      return this.form[parent.name] === '';
    }
  }
}