import { ActivityOptions } from '../../shared/interfaces/common.interface';
import { Action } from '@ngrx/store';

export class ActionFactory {
  public record(options: ActivityOptions): Record {
    return new Record(options);
  }
}

export class InternalActionFactory extends ActionFactory {
  public recordSuccess(): RecordSuccess {
    return new RecordSuccess();
  }
}

export class Record implements Action {
  public static readonly Type = '[Activity] Record';
  public readonly type = Record.Type;
  constructor(public readonly options: ActivityOptions) { }
}

export class RecordSuccess implements Action {
  public static readonly Type = '[Activity] Record Success';
  public readonly type = RecordSuccess.Type;
  constructor() { }
}

export type Any = Record | RecordSuccess;
