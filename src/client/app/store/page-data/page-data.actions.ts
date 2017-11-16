import { Action } from '@ngrx/store';

export class ActionFactory {
  public updateTitle(trKey: string): UpdateTitle {
    return new UpdateTitle(trKey);
  }
}

export class InternalActionFactory extends ActionFactory { }

export class UpdateTitle implements Action {
  public static readonly Type = '[Page Data] Update Title';
  public readonly type = UpdateTitle.Type;
  constructor(public readonly trKey: string) { }
}

export type Any = UpdateTitle;
