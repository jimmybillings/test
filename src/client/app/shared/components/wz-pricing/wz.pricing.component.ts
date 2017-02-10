import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'wz-pricing',
  templateUrl: 'wz.pricing.html'
})
export class WzPricingComponent implements OnInit {
  public form: Array<any>;
  @Input() attributes: Array<any>;
  @Input() dialog: any;
  @Input() usagePrice: Observable<any>;
  @Input() pricingPreferences: any;
  @Output() pricingEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.buildForm();
  }

  public onSubmit(): void {
    this.pricingEvent.emit({ type: 'UPDATE_PREFERENCES', payload: this.formattedForm });
  }

  public parentIsEmpty(currentAttribute: any): boolean {
    // If the currentAttribute is the top-most parent, it should never be disabled
    if (currentAttribute.primary) {
      return false;
    } else {
      // Find the parent attribute of the currentAttribute
      let parent: any = this.findParentOf(currentAttribute);
      // Find the parent's index in the attributes list, and check if its form value is empty
      let parentIndex: number = this.attributes.indexOf(parent);
      return this.form[parentIndex].value === '';
    }
  }

  public validOptionsFor(currentAttribute: any): any {
    // If the parent attribute has not been selected, return;
    if (this.parentIsEmpty(currentAttribute)) return;
    // If the currentAttribute is the primary attribute, the valid choices are its attributeList
    if (currentAttribute.primary) {
      return currentAttribute.attributeList;
    } else {
      // Find the parent attribute of the currentAttribute
      let parent: any = this.findParentOf(currentAttribute);
      // Find the parent's index in the attributes list
      let parentIndex: number = this.attributes.indexOf(parent);
      // Use the parent attribute's name to find its current form value
      let parentFormValue: any = this.form[parentIndex].value;
      // Find the valid choices array that corresponds to the previous option the user selected
      let rawOptions: any = parent.validChildChoicesMap[parentFormValue];
      // There should always be options, however if there aren't we need to alert the user the calculation went wrong
      if (!rawOptions) {
        this.clearForm();
        this.pricingEvent.emit({ type: 'ERORR', payload: 'PRICING.ERROR' });
        return;
      }
      // The raw options is just an array of strings, we need to map them back to the attributeList 
      // of the option to get the name, value, multiplier, etc;
      let options: any = rawOptions.map((o: any) => {
        return this.findOption(o, currentAttribute.attributeList);
      });
      // If there is only 1 option, update the form value for that attribute
      if (options.length === 1) {
        let currentAttributeIndex: number = this.attributes.indexOf(currentAttribute);
        this.form[currentAttributeIndex].value = options[0].name;
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

  public handleSelect(attribute: any, option: any): void {
    let index: number = this.attributes.indexOf(attribute);
    this.clearForm(index);
    this.form[index].value = option.value;
    if (index === this.attributes.length - 1) {
      this.pricingEvent.emit({ type: 'CALCULATE_PRICE', payload: this.formattedForm });
    }
  }

  private findParentOf(currentAttribute: any): any {
    return this.attributes.filter((o: any) => o.childId === currentAttribute.id)[0];
  }

  private findOption(optionName: string, options: any): any {
    return options.filter((o: any) => {
      return o.name === optionName;
    })[0];
  }

  private buildForm(): void {
    this.form = [];
    if (this.pricingPreferences) {
      for (let pref in this.pricingPreferences) {
        this.form.push({ name: pref, value: this.pricingPreferences[pref] });
      }
    } else {
      this.attributes.forEach((attribute: any, index: number) => {
        this.form.push({ name: attribute.name, value: '' });
      });
    }
  }

  private clearForm(index?: number): void {
    index = index ? index : -1;
    this.form.map((field: any, i: number) => {
      if (i > index) field.value = '';
      return field;
    });
    this.usagePrice = null;
  }

  private get formattedForm(): any {
    let formatted: any = {};
    this.form.forEach((field: any) => {
      formatted[field.name] = field.value;
    });
    return formatted;
  }
}
