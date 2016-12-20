import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-pricing',
  templateUrl: 'wz.pricing.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzPricingComponent {
  public _options: any;
  public form: any;
  @Input()
  set options(options: any) {
    this.buildForm(options);
    this._options = options;
  }
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() calculatePricing: EventEmitter<any> = new EventEmitter();
  @Output() error: EventEmitter<any> = new EventEmitter();

  public onSubmit(): void {
    this.calculatePricing.emit(this.form);
  }

  public parentIsEmpty(currentOption: any): boolean {
    // If the currentOption is the top-most parent, it should never be disabled
    if (currentOption.primary) {
      return false;
    } else {
      // Find the parent option of the currentOption, and check if it's value is empty
      let parent: any = this._options.filter((o: any) => o.childId === currentOption.id)[0];
      return this.form[parent.name] === '';
    }
  }

  public validOptionsFor(currentOption: any): any {
    // If the parent option has not been selected, return;
    if (this.parentIsEmpty(currentOption)) return;
    // If the currentOption is the primary option, the valid choices are its attributeList
    if (currentOption.primary) {
      return currentOption.attributeList;
    } else {
      // Find the parent option of the current option
      let parent: any = this.findParent(currentOption);
      // Use the parent option's name to find it's current form value
      let parentFormValue: any = this.form[parent.name];
      // Find the valid choices array that corresponds to the previous option the user selected
      let rawOptions: any = parent.validChildChoicesMap[parentFormValue];
      // There should always be options, however if there aren't we need to alert the user the calculation went wrong
      if (!rawOptions) {
        this.clearForm();
        this.error.emit();
        return;
      }
      // The raw options is just an array of strings, we need to map them back to the attributeList of the option to get the name, value, multiplier, etc;
      let options: any = rawOptions.map((o: any) => { return this.findOption(o, currentOption.attributeList); });
      // If there is only 1 option, update the form value for that option
      if (options.length === 1) {
        this.form[currentOption.name] = options[0].name;
      }
      // Finally, return the valid options
      return options;
    }
  }

  public get formIsInvalid(): boolean {
    let values: any = [];
    for (let field in this.form) {
      values.push(this.form[field]);
    }
    return values.indexOf('') !== -1;
  }

  private findParent(currentOption: any): any {
    return this._options.filter((o: any) => o.childId === currentOption.id)[0];
  }

  private findOption(optionName: string, options: any): any {
    return options.filter((o: any) => {
      return o.name === optionName;
    })[0];
  }

  private buildForm(options: any): void {
    this.form = {};
    options.forEach((option: any) => {
      this.form[option.displayName] = '';
    });
  }

  private clearForm(): void {
    for (let field in this.form) {
      this.form[field]= '';
    }
  }
}