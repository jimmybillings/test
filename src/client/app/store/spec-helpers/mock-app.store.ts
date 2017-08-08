import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import {
  AppStore, ActionFactory, ActionFactoryMapper, InternalActionFactory, InternalActionFactoryMapper, AppState, StateMapper
} from '../../app.store';
import { Pojo } from '../../shared/interfaces/common.interface';

interface Indexable { [sectionName: string]: any; }
interface MockActionFactory extends ActionFactory, Indexable { }
interface MockInternalActionFactory extends InternalActionFactory, Indexable { }
interface MockAppState extends AppState, Indexable { }

export class MockAppStore extends AppStore {
  private _ngrxDispatch: jasmine.Spy = jasmine.createSpy('ngrx dispatch');
  private _actionFactory: MockActionFactory;
  private _internalActionFactory: MockInternalActionFactory;
  private _state: MockAppState;

  constructor() {
    super(null);

    this._actionFactory = {
      activeCollection: {} as any,
      asset: {} as any,
      snackbar: {} as any
    };

    this._internalActionFactory = {
      activeCollection: {} as any,
      asset: {} as any,
      snackbar: {} as any
    };

    this._state = {
      activeCollection: {} as any,
      asset: {} as any,
      snackbar: {} as any
    };

    spyOn(this, 'dispatch').and.callFake((actionFactoryMapper: ActionFactoryMapper) =>
      this._ngrxDispatch(actionFactoryMapper(this._actionFactory))
    );

    spyOn(this, 'create').and.callFake((internalActionFactoryMapper: InternalActionFactoryMapper) =>
      internalActionFactoryMapper(this._internalActionFactory)
    );

    spyOn(this, 'select').and.callFake((stateMapper: StateMapper<any>) => {
      try { return Observable.of(stateMapper(this._state)); } catch (exception) { return Observable.empty(); };
    });

    spyOn(this, 'snapshot').and.callFake((stateMapper: StateMapper<any>) =>
      stateMapper(this._state)
    );

    spyOn(this, 'completeSnapshot').and.returnValue(
      this._state
    );

    spyOn(this, 'match').and.callFake((value: any, stateMapper: StateMapper<any>) =>
      value === stateMapper(this._state)
    );

    spyOn(this, 'blockUntil').and.callFake((stateMapper: StateMapper<boolean>) =>
      stateMapper(this._state) === true ? Observable.of(true) : Observable.empty()
    );
  }

  public createStateSection(stateSectionName: string, value: any): void {
    this._state[stateSectionName] = value;
  }

  public createStateElement(stateSectionName: string, elementName: string, value: any): void {
    this._state[stateSectionName][elementName] = value;
  }

  public createActionFactoryMethod(sectionName: string, methodName: string): jasmine.Spy {
    return this._actionFactory[sectionName][methodName] =
      jasmine.createSpy(`'${methodName} action creator'`).and.returnValue(this.mockActionFrom(methodName));
  }

  public createInternalActionFactoryMethod(sectionName: string, methodName: string): jasmine.Spy {
    return this._internalActionFactory[sectionName][methodName] =
      jasmine.createSpy(`'${methodName} internal action creator'`).and.returnValue(this.mockActionFrom(methodName));
  }

  public expectDispatchFor(actionFactoryMethod: jasmine.Spy, ...expectedParameters: any[]): void {
    expect(actionFactoryMethod).toHaveBeenCalledWith(...expectedParameters);
    expect(this._ngrxDispatch).toHaveBeenCalledWith(this.getActionCreatedBy(actionFactoryMethod));
  }

  public getActionCreatedBy(actionFactoryMethod: jasmine.Spy): any {
    return this.mockActionFrom(actionFactoryMethod.and.identity().replace('\'', '').split(' ')[0]);
  }

  private mockActionFrom(actionFactoryMethodName: string): any {
    return { actionFrom: actionFactoryMethodName };
  }
}
