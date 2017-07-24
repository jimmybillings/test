import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import {
  ActionFactory, ActionFactoryMapper, InternalActionFactory, InternalActionFactoryMapper, AppState, StateMapper
} from '../app.store';

export interface Indexable {
  [sectionName: string]: any;
}

export interface MockActionFactory extends ActionFactory, Indexable { }
export interface MockInternalActionFactory extends InternalActionFactory, Indexable { }
export interface MockAppState extends AppState, Indexable { }

export interface EffectTestInputAction {
  class: any;
  payload?: any;
}

export interface EffectTestState {
  storeSectionName: string,
  propertyName?: string,
  value: any
};

export interface EffectServiceMethod {
  name: string;
  expectedArguments?: any[];
  returnsObservableOf: any;
};

export interface HelperServiceMethod {
  name: string;
  returns: any;
}

export interface EffectTestParameters {
  effectName: string;
  effectsInstantiator: () => any;
  inputAction: EffectTestInputAction;
  state?: EffectTestState | EffectTestState[];
  serviceMethod?: EffectServiceMethod;
  helperServiceMethods?: HelperServiceMethod[];
  outputActionFactory?: {
    sectionName: string;
    methodName: string;
    expectedArguments: any[];
  };
};

export class StoreSpecHelper {
  public readonly mockNgrxEffectsActionSubject: Subject<Action> = new Subject<Action>();

  public mockNgrxEffectsActions: any = {
    ofType: (...types: string[]): Observable<Action> =>
      this.mockNgrxEffectsActionSubject.filter(action => types.some(type => type === action.type))
  };

  public mockService: any = {};

  private mockNgrxDispatch: jasmine.Spy = jasmine.createSpy('ngrx dispatch');

  private mockActionFactory: MockActionFactory = {
    activeCollection: {} as any,
    asset: {} as any,
    snackbar: {} as any
  };

  private mockInternalActionFactory: MockInternalActionFactory = {
    activeCollection: {} as any,
    asset: {} as any,
    snackbar: {} as any
  };

  public mockState: MockAppState = {
    activeCollection: {} as any,
    asset: {} as any,
    snackbar: {} as any
  };

  public mockStore: any = {
    dispatch: jasmine.createSpy('dispatch').and.callFake((actionFactoryMapper: ActionFactoryMapper) =>
      this.mockNgrxDispatch(actionFactoryMapper(this.mockActionFactory))
    ),
    create: jasmine.createSpy('create').and.callFake((internalActionFactoryMapper: InternalActionFactoryMapper) =>
      internalActionFactoryMapper(this.mockInternalActionFactory)
    ),
    select: jasmine.createSpy('select').and.callFake((stateMapper: StateMapper<any>) => {
      try { return Observable.of(stateMapper(this.mockState)) } catch (exception) { return Observable.empty() };
    }),
    snapshot: jasmine.createSpy('snapshot').and.callFake((stateMapper: StateMapper<any>) =>
      stateMapper(this.mockState)
    ),
    completeSnapshot: jasmine.createSpy('completeSnapshot').and.returnValue(
      this.mockState
    ),
    match: jasmine.createSpy('match').and.callFake((value: any, stateMapper: StateMapper<any>) =>
      value === stateMapper(this.mockState)
    ),
    blockUntil: jasmine.createSpy('blockUntil').and.callFake((stateMapper: StateMapper<boolean>) =>
      stateMapper(this.mockState) === true ? Observable.of(true) : Observable.empty()
    )
  };

  public createMockStateSection(stateSectionName: string, value: any): void {
    this.mockState[stateSectionName] = value;
  }

  public createMockStateElement(stateSectionName: string, elementName: string, value: any): void {
    this.mockState[stateSectionName][elementName] = value;
  }

  public createMockActionFactoryMethod(
    actionFactorySectionMapper: (factory: ActionFactory) => any,
    methodName: string
  ): jasmine.Spy {
    return actionFactorySectionMapper(this.mockActionFactory)[methodName] =
      jasmine.createSpy(`'${methodName} action creator'`).and.returnValue(this.mockActionFrom(methodName));
  }

  public createMockInternalActionFactoryMethod(
    internalActionFactorySectionMapper: (factory: InternalActionFactory) => any,
    methodName: string
  ): jasmine.Spy {
    return this.addInternalActionFactorySpyTo(internalActionFactorySectionMapper(this.mockInternalActionFactory), methodName);
  }

  public expectDispatchFor(actionFactoryMethod: jasmine.Spy, ...expectedPayloadArguments: any[]): void {
    expect(actionFactoryMethod).toHaveBeenCalledWith(...expectedPayloadArguments);
    expect(this.mockNgrxDispatch).toHaveBeenCalledWith(this.actionCreatedBy(actionFactoryMethod));
  }

  public createMockServiceMethod(methodName: string, returnValue: any): void {
    this.mockService[methodName] = jasmine.createSpy(`'${methodName} service method'`).and.returnValue(returnValue);
  }

  public expectCreateFor(actionFactoryMethod: jasmine.Spy, ...expectedPayloadArguments: any[]): void {
    expect(actionFactoryMethod).toHaveBeenCalledWith(...expectedPayloadArguments);
  }

  public runStandardEffectTest(parameters: EffectTestParameters): void {
    if (parameters.state) {
      this.createMockStateInfoFrom(parameters.state);
    }

    if (parameters.serviceMethod) {
      this.createMockServiceMethod(parameters.serviceMethod.name, Observable.of(parameters.serviceMethod.returnsObservableOf));
    }

    if (parameters.helperServiceMethods) {
      parameters.helperServiceMethods.forEach(method => {
        this.createMockServiceMethod(method.name, method.returns);
      });
    }

    let actionFactorySpy: jasmine.Spy;
    if (parameters.outputActionFactory) {
      actionFactorySpy = this.addInternalActionFactorySpyTo(
        this.mockInternalActionFactory[parameters.outputActionFactory.sectionName], parameters.outputActionFactory.methodName
      );
    }

    const effect: Observable<Action> = parameters.effectsInstantiator()[parameters.effectName];
    this.checkForEmittedValue(effect, parameters.effectName, parameters.inputAction);

    effect.take(1).subscribe((mappedAction: any) => {
      if (parameters.serviceMethod) {
        expect(this.mockService[parameters.serviceMethod.name])
          .toHaveBeenCalledWith(...parameters.serviceMethod.expectedArguments);
      }

      expect(actionFactorySpy)
        .toHaveBeenCalledWith(...parameters.outputActionFactory.expectedArguments);

      expect(mappedAction)
        .toEqual(this.actionCreatedBy(actionFactorySpy));
    });

    this.simulateInputAction(parameters.inputAction);
  }

  public runCustomEffectTest(parameters: EffectTestParameters, test: (action: Action) => void): void {
    if (parameters.state) {
      this.createMockStateInfoFrom(parameters.state);
    }

    if (parameters.helperServiceMethods) {
      parameters.helperServiceMethods.forEach(method => {
        this.createMockServiceMethod(method.name, method.returns);
      });
    }

    const effect: Observable<Action> = parameters.effectsInstantiator()[parameters.effectName];
    this.checkForEmittedValue(effect, parameters.effectName, parameters.inputAction);

    effect.take(1).subscribe(test);

    this.simulateInputAction(parameters.inputAction);
  }

  public actionCreatedBy(actionFactoryMethod: jasmine.Spy): any {
    return this.mockActionFrom(actionFactoryMethod.and.identity().replace('\'', '').split(' ')[0]);
  }

  private mockActionFrom(actionFactoryMethodName: string): any {
    return { actionFrom: actionFactoryMethodName };
  }

  private addInternalActionFactorySpyTo(section: any, methodName: string) {
    return section[methodName] =
      jasmine.createSpy(`'${methodName} internal action creator'`).and.returnValue(this.mockActionFrom(methodName));
  }

  private checkForEmittedValue(effect: Observable<Action>, effectName: string, inputAction: EffectTestInputAction): void {
    const expectedExceptionMessage: string = 'Expected exception message';

    try {
      effect.take(1).subscribe(action => { throw new Error(expectedExceptionMessage); });
      this.simulateInputAction(inputAction);

      // Uh-oh.  We shouldn't have made it here because we threw an exception inside the subscription.
      fail(`Expected effect '${effectName}' to emit a value.
        1. Expecting it to have been triggered by an action with type '${inputAction.class.Type}' -- was it?
        2. Is one of the effect's mapping methods not emitting a value?`);
    } catch (exception) {
      if (exception.message !== expectedExceptionMessage) {
        // Uh-oh.  We caught an exception, but not the one we expected.  Rethrow it so it shows up in the test output.
        throw exception;
      }

      // Good.  We caught the expected exception, which means the effect was triggered by the expected action.
    }
  }

  private createMockStateInfoFrom(oneOrMoreStateParameters: EffectTestState | EffectTestState[]) {
    (Array.isArray(oneOrMoreStateParameters) ? oneOrMoreStateParameters : [oneOrMoreStateParameters])
      .forEach(stateParameter => {
        if (stateParameter.propertyName) {
          this.createMockStateElement(stateParameter.storeSectionName, stateParameter.propertyName, stateParameter.value);
        } else {
          this.createMockStateSection(stateParameter.storeSectionName, stateParameter.value);
        }
      });
  }

  private simulateInputAction(inputAction: EffectTestInputAction): void {
    this.mockNgrxEffectsActionSubject.next({ type: inputAction.class.Type, payload: inputAction.payload });
  }
}
