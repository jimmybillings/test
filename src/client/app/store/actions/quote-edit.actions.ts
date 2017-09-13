import { Action } from '@ngrx/store';

import { Quote } from '../../shared/interfaces/commerce.interface';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory {
  public load(): Load {
    return new Load();
  }

  public delete(): Delete {
    return new Delete();
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

  public deleteSuccess(quote: Quote): DeleteSuccess {
    return new DeleteSuccess(quote);
  }

  public deleteFailure(error: ApiErrorResponse): DeleteFailure {
    return new DeleteFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Quote Edit] Load';
  public readonly type = Load.Type;
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Quote Edit] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly quote: Quote) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Quote Edit] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class Delete implements Action {
  public static readonly Type = '[Quote Edit] Delete';
  public readonly type = Delete.Type;
}

export class DeleteSuccess implements Action {
  public static readonly Type = '[Quote Edit] Delete Success';
  public readonly type = DeleteSuccess.Type;
  constructor(public readonly quote: Quote) { }
}

export class DeleteFailure implements Action {
  public static readonly Type = '[Quote Edit] Delete Failure';
  public readonly type = DeleteFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any =
  Load | LoadSuccess | LoadFailure |
  Delete | DeleteSuccess | DeleteFailure;
