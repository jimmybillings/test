import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-pricing',
  templateUrl: 'wz.pricing.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzPricingComponent implements OnInit {
  public form: any;
  @Input() options: Array<any>;
  @Input() dialog: any;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() calculatePricing: EventEmitter<any> = new EventEmitter();
  @Output() error: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.buildForm(this.options);
  }

  public onSubmit(): void {
    this.dialog.close({ attributes: this.form });
  }

  public parentIsEmpty(currentOption: any): boolean {
    // If the currentOption is the top-most parent, it should never be disabled
    if (currentOption.primary) {
      return false;
    } else {
      // Find the parent option of the currentOption
      let parent: any = this.findParentOf(currentOption);
      // Find the parent's index in the options list, and check if its form value is empty
      let parentIndex: number = this.options.indexOf(parent);
      return this.form[parentIndex].value === '';
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
      let parent: any = this.findParentOf(currentOption);
      // Find the parent's index in the options list
      let parentIndex: number = this.options.indexOf(parent);
      // Use the parent option's name to find it's current form value
      let parentFormValue: any = this.form[parentIndex].value;
      // Find the valid choices array that corresponds to the previous option the user selected
      let rawOptions: any = parent.validChildChoicesMap[parentFormValue];
      // There should always be options, however if there aren't we need to alert the user the calculation went wrong
      if (!rawOptions) {
        this.clearForm();
        this.dialog.close({ error: null });
        return;
      }
      // The raw options is just an array of strings, we need to map them back to the attributeList 
      // of the option to get the name, value, multiplier, etc;
      let options: any = rawOptions.map((o: any) => {
        return this.findOption(o, currentOption.attributeList);
      });
      // If there is only 1 option, update the form value for that option
      if (options.length === 1) {
        let currentOptionIndex: number = this.options.indexOf(currentOption);
        this.form[currentOptionIndex].value = options[0].name;
      }
      // Finally, return the valid options
      return options;
    }
  }

  // Checks if any of the values in the form are an empty string
  public get formIsInvalid(): boolean {
    return this.form.reduce((prev: Array<any>, current: any) => {
      prev.push(current.value);
      return prev;
    }, []).indexOf('') !== -1;
  }

  public clearChildren(option: any): void {
    let index: number = this.options.indexOf(option);
    this.clearForm(index);
  }

  private findParentOf(currentOption: any): any {
    return this.options.filter((o: any) => o.childId === currentOption.id)[0];
  }

  private findOption(optionName: string, options: any): any {
    return options.filter((o: any) => {
      return o.name === optionName;
    })[0];
  }

  private buildForm(options: any): void {
    this.form = [];
    options.forEach((option: any, index: number) => {
      this.form.push({ name: option.name, value: '' });
    });
  }

  private clearForm(index?: number): void {
    index = index ? index + 1 : -1;
    console.log(this.form);
    this.form.map((field: any, i: number) => {
      if (i > index) field.value = '';
      return field;
    });
  }
}
