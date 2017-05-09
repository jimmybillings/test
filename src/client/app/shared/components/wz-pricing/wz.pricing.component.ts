import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MdOption } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PriceAttribute, PriceOption } from '../../interfaces/commerce.interface';
import { Poj, WzEvent } from '../../interfaces/common.interface';
// temporary interface until material gets their shit together - remove with new release
// see here https://github.com/angular/material2/commit/af978cd6edc75113941b3e0e8df7a220e8d730be
// and here https://github.com/angular/material2/blob/master/src/lib/core/option/option.ts#L26
export interface MdOptionSelectionChange {
  source: MdOption;
  isUserInput: boolean;
};

@Component({
  moduleId: module.id,
  selector: 'wz-pricing',
  templateUrl: 'wz.pricing.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzPricingComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  @Input() attributes: Array<PriceAttribute>;
  @Input() usagePrice: Observable<number>;
  @Input() pricingPreferences: Poj;
  @Output() pricingEvent: EventEmitter<WzEvent> = new EventEmitter<WzEvent>();
  private subscription: Subscription;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    if (this.pricingPreferences && !this.pricingStructureChanged) {
      this.pricingEvent.emit({ type: 'CALCULATE_PRICE', payload: this.pricingPreferences });
      this.form = this.prePopulatedForm;
    } else {
      this.form = this.blankForm;
    }
    this.subscription = this.form.valueChanges.subscribe((value: any) => {
      if (this.form.valid) this.pricingEvent.emit({ type: 'CALCULATE_PRICE', payload: this.formattedForm });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onSubmit(): void {
    // When the form is opened at the project level in a cart/quote, there is no usagePrice
    if (this.usagePrice) {
      this.usagePrice.take(1).subscribe((price: number) => {
        this.pricingEvent.emit({ type: 'APPLY_PRICE', payload: { price: price, attributes: this.formattedForm } });
      });
    } else {
      this.pricingEvent.emit({ type: 'APPLY_PRICE', payload: { attributes: this.formattedForm } });
    }
  }

  public parentIsEmpty(currentAttribute: PriceAttribute): boolean {
    // If the currentAttribute is the top-most parent, it should never be disabled
    if (currentAttribute.primary) {
      return false;
    } else {
      // Find the parent attribute of the currentAttribute
      let parent: PriceAttribute = this.findParentOf(currentAttribute);
      return this.form.controls[parent.name].value === '';
    }
  }

  public validOptionsFor(currentAttribute: PriceAttribute): Array<PriceOption> | void {
    // If the parent attribute has not been selected, return;
    if (this.parentIsEmpty(currentAttribute)) return;
    // If the currentAttribute is the primary attribute, the valid choices are its attributeList
    if (currentAttribute.primary) {
      return currentAttribute.attributeList;
    } else {
      // Find the parent attribute of the currentAttribute
      let parent: PriceAttribute = this.findParentOf(currentAttribute);
      // Use the parent attribute's name to find its current form value
      let parentFormValue: string = this.form.controls[parent.name].value;
      // Find the valid choices array that corresponds to the previous option the user selected
      let rawOptions: Array<string> = parent.validChildChoicesMap[parentFormValue];
      // There should always be options, however if there aren't we need to alert the user the calculation went wrong
      if (!rawOptions) {
        this.clearForm();
        this.pricingEvent.emit({ type: 'ERROR', payload: 'PRICING.ERROR' });
        return;
      }
      // The raw options is just an array of strings, we need to map them back to the attributeList
      // of the option to get the name, value, multiplier, etc;
      let options: Array<PriceOption> = rawOptions.map((option: string) => {
        return this.findOption(option, currentAttribute.attributeList);
      });
      // If there is only 1 option, update the form value for that attribute
      if (options.length === 1) {
        this.form.controls[currentAttribute.name].setValue(options[0].name);
      }
      // Finally, return the valid options
      return options;
    }
  }

  public handleSelect(event: MdOptionSelectionChange, attribute: PriceAttribute): void {
    if (event.isUserInput) {
      this.clearForm(this.attributes.indexOf(attribute));
    }
  }

  private findParentOf(currentAttribute: PriceAttribute): PriceAttribute {
    return this.attributes.find((attribute: PriceAttribute) => attribute.childId === currentAttribute.id);
  }

  private findOption(optionName: string, options: Array<PriceOption>): PriceOption {
    return options.find((attribute: PriceOption) => attribute.name === optionName);
  }

  /**
   * @returns a FormGroup with values filled in based on user preferences
   */
  private get prePopulatedForm(): FormGroup {
    let form: Poj = {};
    for (let pref in this.pricingPreferences) {
      form[pref] = [this.pricingPreferences[pref]];
      form[pref].push(Validators.required);
    }
    return this.fb.group(form);
  }

  /**
   * @returns a FormGroup with blank values
   */
  private get blankForm(): FormGroup {
    let form: Poj = {};
    this.attributes.forEach((attribute: PriceAttribute) => {
      form[attribute.name] = [''];
      form[attribute.name].push(Validators.required);
    });
    return this.fb.group(form);
  }

  /**
    * @param { number } index
    * Given an index, this function will clear the form fields greater than that index.
     * i.e. given a 2, it will clear fields 3,4,5...
    * Given no index, it will clear the entire form
  */
  private clearForm(index?: number): void {
    index = index ? index : -1;
    Object.keys(this.form.controls).forEach((key: string, i: number) => {
      if (i > index) this.form.controls[key].setValue('');
    });
  }

  /**
   * @returns the form in object form, as opposed to an array of objects
   * @example [{ name: 'Distribution', value: 'Online' }, ...] -> { Distribution: 'Online', ... }
   */
  private get formattedForm(): Poj {
    let formatted: Poj = {};
    for (let controlName in this.form.controls) {
      formatted[controlName] = this.form.controls[controlName].value;
    }
    return formatted;
  }

  /**
   * @returns a boolean that represents whether the structure of the pricing options changed
   * by comparing keys of the user preference vs. the actual pricing options
   */
  private get pricingStructureChanged(): boolean {
    return Object.keys(this.pricingPreferences).filter((pref: string, index: number) => {
      return pref !== this.attributes[index].name;
    }).length > 0;
  }
}
