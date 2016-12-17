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
    'Term': '',
    'Territory': '',
    'Use': ''
  };
  @Input() options: any;
  @Output() commitPricing: EventEmitter<any> = new EventEmitter();

  public onSubmit(): void {
    this.commitPricing.emit(this.form);
  }

  public parentIsEmpty(currentOption: any): boolean {
    // If the currentOption is the top-most parent, it should never be disabled
    if (currentOption.primary) {
      return false;
    } else {
      // Find the parent option of the currentOption, and check if it's value is empty
      let parent: any = this.options.filter((o: any) => o.childId === currentOption.id)[0];
      return this.form[parent.name] === '';
    }
  }

  public validOptionsFor(currentOption: any): any {
    // If the parent option has not been selected, return;
    if (this.parentIsEmpty(currentOption)) return;
    // If the currentOption is the parent, the valid choices are its attributeList
    if (currentOption.primary) {
      return currentOption.attributeList;
    } else {
      // Find the parent option of the current option
      let parent: any = this.options.filter((o: any) => o.childId === currentOption.id)[0];
      // Use the parent option's name to find it's current form value
      let parentValue: any = this.form[parent.name];
      // Find the valid choices array that corresponds to the option the user selected
      let rawOptions: any = parent.validChildChoicesMap[parentValue];
      // The raw options is just an array of strings, we need to map them back to the attributeList of the option to get the name, value, multiplier, etc;
      return rawOptions.map((o: any) => { return this.findOption(o, currentOption.attributeList); });
    }
  }

  private findOption(optionName: string, options: any): any {
    return options.filter((o: any) => {
      return o.name === optionName;
    })[0];
  }
}