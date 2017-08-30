import { Action } from '@ngrx/store';

import { Cart } from '../../shared/interfaces/commerce.interface';
import { AssetLoadParameters } from '../../shared/interfaces/common.interface';

export class ActionFactory {
  public load(): Load {
    return new Load();
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(cart: Cart): LoadSuccess {
    return new LoadSuccess(cart);
  }
}

export class Load implements Action {
  public static readonly Type = '[Cart] Load';
  public readonly type = Load.Type;
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Cart] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly cart: Cart) { }
}

export type Any = Load | LoadSuccess;
