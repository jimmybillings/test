import { Action } from '@ngrx/store';

import { Quote } from '../../shared/interfaces/commerce.interface';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory {
  public load(): Load {
    return new Load();
  }

  // Move this to internal action factory when quote is fully "effected"
  public loadSuccess(quote: Quote): LoadSuccess {
    return new LoadSuccess(quote);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Quote] Load';
  public readonly type = Load.Type;
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Quote] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly quote: Quote) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Quote] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any = Load | LoadSuccess | LoadFailure;
