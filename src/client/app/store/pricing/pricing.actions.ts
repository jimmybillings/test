import { Action } from '@ngrx/store';

import { ApiErrorResponse } from '../../shared/interfaces/api.interface';
import { PriceAttribute } from '../../shared/interfaces/commerce.interface';
import { Pojo } from '../../shared/interfaces/common.interface';

export class ActionFactory {
  public setPriceForDetails(price: number): SetPriceForDetails {
    return new SetPriceForDetails(price);
  }

  public setPriceForDialog(price: number): SetPriceForDialog {
    return new SetPriceForDialog(price);
  }

  public setAppliedAttributes(appliedAttributes: Pojo): SetAppliedAttributes {
    return new SetAppliedAttributes(appliedAttributes);
  }

  public getAttributes(rightsReproduction: string): GetAttributes {
    return new GetAttributes(rightsReproduction);
  }

  public openPricingDialog(): OpenPricingDialog {
    return new OpenPricingDialog();
  }

  public calculatePriceFor(selectedAttributes: Pojo): CalculatePrice {
    return new CalculatePrice(selectedAttributes);
  }
}

export class InternalActionFactory extends ActionFactory {
  public getAttributesSuccess(attributes: PriceAttribute[]): GetAttributesSuccess {
    return new GetAttributesSuccess(attributes);
  }

  public getAttributesFailure(error: ApiErrorResponse): GetAttributesFailure {
    return new GetAttributesFailure(error);
  }

  public calculatePriceSuccess(price: number): CalculatePriceSuccess {
    return new CalculatePriceSuccess(price);
  }

  public calculatePriceFailure(error: ApiErrorResponse): CalculatePriceFailure {
    return new CalculatePriceFailure(error);
  }
}

export class GetAttributes implements Action {
  public static readonly Type = '[Pricing] Get Attributes';
  public readonly type = GetAttributes.Type;
  constructor(public readonly rightsReproduction: string) { }
}

export class GetAttributesSuccess implements Action {
  public static readonly Type = '[Pricing] Get Attributes Success';
  public readonly type = GetAttributesSuccess.Type;
  constructor(public readonly attributes: PriceAttribute[]) { }
}

export class GetAttributesFailure implements Action {
  public static readonly Type = '[Pricing] Get Attributes Failure';
  public readonly type = GetAttributesFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class SetPriceForDetails implements Action {
  public static readonly Type = '[Pricing] Set Price For Details';
  public readonly type = SetPriceForDetails.Type;
  constructor(public readonly price: number) { }
}

export class SetPriceForDialog implements Action {
  public static readonly Type = '[Pricing] Set Price For Dialog';
  public readonly type = SetPriceForDialog.Type;
  constructor(public readonly price: number) { }
}

export class SetAppliedAttributes implements Action {
  public static readonly Type = '[Pricing] Set Applied Attributes';
  public readonly type = SetAppliedAttributes.Type;
  constructor(public readonly appliedAttributes: Pojo) { }
}

export class CalculatePrice implements Action {
  public static readonly Type = '[Pricing] Calculate';
  public readonly type = CalculatePrice.Type;
  constructor(public readonly selectedAttributes: Pojo) { }
}

export class CalculatePriceSuccess implements Action {
  public static readonly Type = '[Pricing] Calculate Success';
  public readonly type = CalculatePriceSuccess.Type;
  constructor(public readonly price: number) { }
}

export class CalculatePriceFailure implements Action {
  public static readonly Type = '[Pricing] Calculate Failure';
  public readonly type = CalculatePriceFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class OpenPricingDialog implements Action {
  public static readonly Type = '[Pricing] Open Dialog';
  public readonly type = OpenPricingDialog.Type;
}

export type Any = GetAttributes | GetAttributesSuccess | GetAttributesFailure | SetPriceForDetails | SetPriceForDialog |
  SetAppliedAttributes | CalculatePrice | CalculatePriceSuccess | CalculatePriceFailure | OpenPricingDialog;
