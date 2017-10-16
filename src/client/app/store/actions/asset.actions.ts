import { Action } from '@ngrx/store';

export class ActionFactory { }

export class InternalActionFactory extends ActionFactory {
  public setDeliveryOptions(flag: boolean): SetDeliveryOptions {
    return new SetDeliveryOptions(flag);
  }
}

export class SetDeliveryOptions implements Action {
  public static readonly Type = '[Asset] Set Delivery Options';
  public readonly type = SetDeliveryOptions.Type;
  constructor(public readonly flag: boolean) { }
}

export type Any = SetDeliveryOptions;
