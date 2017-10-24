import { Action } from '@ngrx/store';

export class ActionFactory { }

export class InternalActionFactory extends ActionFactory { }

export class SomeAction implements Action {
  public static readonly Type = '[Help Request] Some Action';
  public readonly type = SomeAction.Type;
}

export type Any = SomeAction;
