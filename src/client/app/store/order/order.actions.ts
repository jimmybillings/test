import { Action } from '@ngrx/store';

import { Order, Invoice } from '../../shared/interfaces/commerce.interface';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory {
  public load(orderId: number): Load {
    return new Load(orderId);
  }

  public loadInvoice(orderId: number): LoadInvoice {
    return new LoadInvoice(orderId);
  }

  // TODO: Move me into Internal.
  public loadSuccess(order: Order): LoadSuccess {
    return new LoadSuccess(order);
  }

  public setCheckoutState(checkingOut: boolean): SetCheckoutState {
    return new SetCheckoutState(checkingOut);
  }
}

export class InternalActionFactory extends ActionFactory {

  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }

  public loadInvoiceSuccess(invoice: Invoice): LoadInvoiceSuccess {
    return new LoadInvoiceSuccess(invoice);
  }

  public loadInvoiceFailure(error: ApiErrorResponse): LoadInvoiceFailure {
    return new LoadInvoiceFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Order] Load';
  public readonly type = Load.Type;
  constructor(public readonly orderId: number) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Order] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly activeOrder: Order) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Order] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class SetCheckoutState implements Action {
  public static readonly Type = '[Order] Set Checkout State';
  public readonly type = SetCheckoutState.Type;
  constructor(public readonly checkingOut: boolean) { }
}

export class LoadInvoice implements Action {
  public static readonly Type = '[Order] Load Invoice';
  public readonly type = LoadInvoice.Type;
  constructor(public readonly orderId: number) { };
}

export class LoadInvoiceSuccess implements Action {
  public static readonly Type = '[Order] Load Invoice Success';
  public readonly type = LoadInvoiceSuccess.Type;
  constructor(public readonly invoice: Invoice) { };
}

export class LoadInvoiceFailure implements Action {
  public static readonly Type = '[Order] Load Invoice Failure';
  public readonly type = LoadInvoiceFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any = Load | LoadSuccess | LoadFailure | SetCheckoutState | LoadInvoice | LoadInvoiceSuccess;
