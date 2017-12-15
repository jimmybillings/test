import { Action } from '@ngrx/store';

export class ActionFactory {
  public loadFooter(): LoadFooter {
    return new LoadFooter();
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadFooterSuccess(footer: any): LoadFooterSuccess {
    return new LoadFooterSuccess(footer);
  }
}

export class LoadFooter implements Action {
  public static readonly Type = '[Cms] Load Footer';
  public readonly type = LoadFooter.Type;
}

export class LoadFooterSuccess implements Action {
  public static readonly Type = '[Cms] Load Footer Success';
  public readonly type = LoadFooterSuccess.Type;
  constructor(public readonly footer: any) { }
}

export type Any = LoadFooter | LoadFooterSuccess;
