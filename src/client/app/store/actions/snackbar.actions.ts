import { Action } from '@ngrx/store';

import { Pojo } from '../../shared/interfaces/common.interface';

export class ActionFactory {
  public display(messageKey: string, messageParameters: Pojo = {}): Display {
    return new Display({ messageKey, messageParameters });
  }
}

export class InternalActionFactory extends ActionFactory {
  public displaySuccess(translatedString: string): DisplaySuccess {
    return new DisplaySuccess(translatedString);
  }
}

export class Display implements Action {
  public static readonly Type = '[Snackbar] Display';
  public readonly type = Display.Type;
  constructor(public readonly payload: { readonly messageKey: string, readonly messageParameters: Pojo }) { }
}

export class DisplaySuccess implements Action {
  public static readonly Type = '[Snackbar] Display Success';
  public readonly type = DisplaySuccess.Type;
  constructor(public readonly payload: string) { }
}

export type Any = Display | DisplaySuccess;
