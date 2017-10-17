import { Action } from '@ngrx/store';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory { }

export class InternalActionFactory extends ActionFactory {
  public setDeliveryOptions(flag: boolean): SetDeliveryOptions {
    return new SetDeliveryOptions(flag);
  }

  public setDeliveryOptionsFailure(error: ApiErrorResponse): SetDeliveryOptionsFailure {
    return new SetDeliveryOptionsFailure(error);
  }
}

export class SetDeliveryOptions implements Action {
  public static readonly Type = '[Asset] Set Delivery Options';
  public readonly type = SetDeliveryOptions.Type;
  constructor(public readonly flag: boolean) { }
}

export class SetDeliveryOptionsFailure implements Action {
  public static readonly Type = '[Asset] Set Delivery Options Failure';
  public readonly type = SetDeliveryOptionsFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any = SetDeliveryOptions;
