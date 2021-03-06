import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PriceAttribute, PriceOption } from '../../interfaces/commerce.interface';
import { Pojo, WzEvent } from '../../interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-pricing',
  templateUrl: 'wz.pricing.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzPricingComponent implements OnDestroy {
  public form: FormGroup;
  @Output() pricingEvent: EventEmitter<WzEvent> = new EventEmitter<WzEvent>();
  @Input() attributes: Array<PriceAttribute>;
  @Input() usagePrice: Observable<number>;
  @Input()
  set pricingPreferences(preferences: Pojo) {
    this._pricingPreferences = preferences;
    if (!this.form) {
      this.buildForm();
    }
    if (this.pricingPreferences !== {} && !this.priceBookChanged) {
      setTimeout(() => { this.pricingEvent.emit({ type: 'CALCULATE_PRICE', payload: this._pricingPreferences }); }, 0);
    }
  }
  private formSubscription: Subscription;
  private _pricingPreferences: Pojo;
  constructor(private fb: FormBuilder) { }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  public onSubmit(): void {
    if (!this.form.valid) return;
    // When the form is opened at the project level in a cart/quote, there is no usagePrice
    if (this.usagePrice) {
      this.usagePrice.take(1).subscribe((price: number) => {
        this.pricingEvent.emit({ type: 'APPLY_PRICE', payload: { price: price, attributes: this.form.value } });
      });
    } else {
      this.pricingEvent.emit({ type: 'APPLY_PRICE', payload: { attributes: this.form.value } });
    }
  }

  public parentIsEmpty(currentAttribute: PriceAttribute): boolean {
    // If the currentAttribute is the top-most parent, it should never be disabled
    if (currentAttribute.primary) {
      return false;
    } else {
      // Find the parent attribute of the currentAttribute and check that its value is not empty
      const parent: PriceAttribute = this.findParentOf(currentAttribute);
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
      const parent: PriceAttribute = this.findParentOf(currentAttribute);
      // Use the parent attribute's name to find its current form value
      const parentFormValue: string = this.form.controls[parent.name].value;
      // Find the valid choices array that corresponds to the previous option the user selected
      const rawOptions: Array<string> = parent.validChildChoicesMap[parentFormValue];
      // There should always be options, however if there aren't we need to alert the user the calculation went wrong
      if (!rawOptions) {
        this.clearForm(Object.keys(this.form.controls));
        this.pricingEvent.emit({ type: 'ERROR', payload: 'PRICING.ERROR' });
        return;
      }
      // The raw options is just an array of strings that represent attribute values
      // we need to map them back to the attributeList of the option to get the name, value, multiplier, etc;
      const options: Array<PriceOption> = rawOptions.map((optionValue: string) => {
        return this.findOption(optionValue, currentAttribute.attributeList);
      });
      // Finally, return the valid options
      return options;
    }
  }

  public handleSelect(event: any, attribute: PriceAttribute): void {
    if (event.isUserInput) {
      const controlNames: Array<string> = Object.keys(this.form.controls);
      const currentControlIndex: number = controlNames.indexOf(attribute.name);
      const controlNamesToClear: Array<string> = controlNames.slice(currentControlIndex + 1);
      const controlNamesToDisable: Array<string> = controlNames.slice(currentControlIndex + 2);
      if (controlNamesToClear.length > 0) this.clearForm(controlNamesToClear);
      if (controlNamesToDisable.length > 0) this.disableForm(controlNamesToDisable);
    }
  }

  private findParentOf(currentAttribute: PriceAttribute): PriceAttribute {
    return this.attributes.find((attribute: PriceAttribute) => attribute.childId === currentAttribute.id);
  }

  private findOption(optionValue: string, options: Array<PriceOption>): PriceOption {
    return options.find((attribute: PriceOption) => attribute.value === optionValue);
  }

  private buildForm(): void {
    let form: Pojo = {};

    this.attributes.forEach((attribute: PriceAttribute, index: number) => {
      const value: string = this._pricingPreferences[attribute.name] || '';
      form[attribute.name] = new FormControl({
        value: value || '',
        disabled: value ? false : index !== 0
      }, Validators.required);
    });

    this.form = this.fb.group(form);

    this.formSubscription = this.form.valueChanges.subscribe((value: string) => {
      if (this.form.valid) {
        this.pricingEvent.emit({ type: 'CALCULATE_PRICE', payload: value });
      }
    });
  }

  private clearForm(controlNames: Array<string>): void {
    for (let controlName of controlNames) {
      const control: AbstractControl = this.form.controls[controlName];
      control.setValue('');
      control.enable();
    }
  }

  private disableForm(controlNames: Array<string>): void {
    for (let control of controlNames) {
      this.form.controls[control].disable();
    }
  }

  // this does a comparison of the user's preferences and the current price attributes to make sure
  // that the price book hasn't changed drastically - i.e. should we prepopulate the form. It ignores order
  // NOTE: ['a', 'b', 'c'] === ['b', 'c', 'a'] // => true
  public get priceBookChanged(): boolean {
    const attributeNames: Array<string> = this.attributes.map((attr: PriceAttribute) => attr.name).sort();
    const prefNames: Array<string> = Object.keys(this._pricingPreferences).sort();
    return !prefNames.every((pref: string, index: number) => pref === attributeNames[index]);
  }
}
