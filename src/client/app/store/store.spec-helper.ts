import { Action, ActionReducer } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import {
  ActionFactory, ActionFactoryMapper, InternalActionFactory, InternalActionFactoryMapper, AppState, StateMapper
} from '../app.store';
import { Pojo } from '../shared/interfaces/common.interface';

export interface Indexable {
  [sectionName: string]: any;
}

export interface MockActionFactory extends ActionFactory, Indexable { }
export interface MockInternalActionFactory extends InternalActionFactory, Indexable { }
export interface MockAppState extends AppState, Indexable { }

export interface ParameterizedAction extends Action {
  [parameterName: string]: any;
}

export interface EffectTestState {
  storeSectionName: string;
  propertyName?: string;
  value: any;
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
  inputAction: ParameterizedAction;
  state?: EffectTestState | EffectTestState[];
  serviceMethod?: EffectServiceMethod;
  helperServiceMethods?: HelperServiceMethod[];
  outputActionFactory?: {
    sectionName: string;
    methodName: string;
    expectedArguments: any[];
  };
};

export interface ActionFactoryTestParameters {
  comment?: string;
  factoryMethod: {
    class: any;
    name: string;
    parameters: any[];
  };
  expectedAction: ParameterizedAction;
};

export interface ReducerTestModules {
  actions: Pojo;
  state: Pojo;
};

export interface ReducerTestParameters {
  actionClassName: string | string[];
  mutationTestData?: {
    previousState?: Pojo;
    actionParameters?: Pojo;
  },
  customTests: {
    it: string;
    previousState?: Pojo;
    actionParameters?: Pojo;
    expectedNextState: Pojo;
  }[]
};

export class StoreSpecHelper {
  public readonly mockNgrxEffectsActionSubject: Subject<ParameterizedAction> = new Subject<ParameterizedAction>();

  public mockNgrxEffectsActions: any = {
    ofType: (...types: string[]): Observable<Action> =>
      this.mockNgrxEffectsActionSubject.filter(action => types.some(type => type === action.type))
  };

  public mockService: any = {};

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
      try { return Observable.of(stateMapper(this.mockState)); } catch (exception) { return Observable.empty(); };
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

  private reducerTestModules: ReducerTestModules = null;

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

  public expectDispatchFor(actionFactoryMethod: jasmine.Spy, ...expectedParameters: any[]): void {
    expect(actionFactoryMethod).toHaveBeenCalledWith(...expectedParameters);
    expect(this.mockNgrxDispatch).toHaveBeenCalledWith(this.actionCreatedBy(actionFactoryMethod));
  }

  public createMockServiceMethod(methodName: string, returnValue: any): void {
    this.mockService[methodName] = jasmine.createSpy(`'${methodName} service method'`).and.returnValue(returnValue);
  }

  public expectCreateFor(actionFactoryMethod: jasmine.Spy, ...expectedParameters: any[]): void {
    expect(actionFactoryMethod).toHaveBeenCalledWith(...expectedParameters);
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

  public runStandardActionTestFor(parameters: ActionFactoryTestParameters): void {
    const methodName: string = parameters.factoryMethod.name;
    const optionalComment: string = parameters.comment ? ` (${parameters.comment})` : '';

    describe(`${methodName}()`, () => {
      it(`creates the expected action${optionalComment}`, () => {
        const createdAction =
          (new parameters.factoryMethod.class() as any)[methodName](...parameters.factoryMethod.parameters);

        expect(Object.keys(createdAction).length).toBe(Object.keys(parameters.expectedAction).length);

        Object.keys(createdAction).forEach(key => {
          expect(createdAction[key]).toEqual(parameters.expectedAction[key]);
        });
      });
    });
  }

  public setReducerTestModules(modules: ReducerTestModules): void {
    this.reducerTestModules = modules;

    describe('for an unexpected action', () => {
      it('with previous state, returns previous state', () => {
        expect(modules.state.reducer({ previous: 'state' }, { type: 'BLAH' })).toEqual({ previous: 'state' });
      });

      it('without previous state, returns initial state', () => {
        expect(modules.state.reducer(undefined, { type: 'BLAH' })).toEqual(modules.state.initialState);
      });
    });
  }

  public addReducerTestsFor(parameters: ReducerTestParameters): void {
    const actionClassNames: string[] =
      Array.isArray(parameters.actionClassName) ? parameters.actionClassName : [parameters.actionClassName]

    actionClassNames.forEach(actionClassName => {
      if (!this.reducerTestModules) {
        describe(`for ${actionClassName} (unknown action type)`, () => {
          it('has modules defined for test', () => {
            fail(`setStandardReducerTestModules() needs to be called before addStandardReducerTestsFor()`);
          });
        });

        return;
      }

      const reducerUnderTest: ActionReducer<any> = this.reducerTestModules.state.reducer;
      const actionType: string = this.reducerTestModules.actions[actionClassName].Type;

      describe(`for ${actionClassName} ('${actionType}')`, () => {
        parameters.customTests.forEach(test => {
          it(test.it, () => {
            const testAction: any = { type: actionType, ...test.actionParameters };

            expect(reducerUnderTest(test.previousState, testAction)).toEqual(test.expectedNextState);
          });
        });

        describe('meets basic reducer standards, because it:', () => {
          const testAction: any = {
            type: actionType,
            ...(parameters.mutationTestData ? (parameters.mutationTestData.actionParameters || []) : [])
          };
          const previousState: Pojo = parameters.mutationTestData ? parameters.mutationTestData.previousState : undefined;
          const previousStateSnapshot: string = JSON.stringify(previousState);
          const initialState: Pojo = this.reducerTestModules.state.initialState;
          const initialStateSnapshot: string = JSON.stringify(initialState);

          it('does not throw an exception when the previous state is null', () => {
            expect(() => reducerUnderTest(null, testAction)).not.toThrow();
          });

          it('has test parameters sufficient to prove lack of mutation', () => {
            const newState = reducerUnderTest(previousState, testAction);

            if (JSON.stringify(newState) === (previousStateSnapshot || initialStateSnapshot)) {
              fail('The test parameters do not cause a difference between pre- and post-action states for this reducer,'
                + ' so we cannot determine whether it could potentially mutate the previous state.'
                + ' (Specify \'mutationTestData\' with \'previousState\' and/or \'actionParameters\' to ensure a state change.)');
            }
          });

          it('does not directly mutate the previous state', () => {
            reducerUnderTest(previousState, testAction);

            const postReducerSnapshot = JSON.stringify(previousState);

            expect(postReducerSnapshot).toEqual(previousStateSnapshot);
          });

          it('does not directly mutate the initial state when there was a previous state', () => {
            reducerUnderTest(previousState, testAction);

            const postReducerSnapshot = JSON.stringify(initialState);

            expect(postReducerSnapshot).toEqual(initialStateSnapshot);
          });

          it('does not directly mutate the initial state when there was not a previous state', () => {
            reducerUnderTest(undefined, testAction);

            const postReducerSnapshot = JSON.stringify(initialState);

            expect(postReducerSnapshot).toEqual(initialStateSnapshot);
          });

          it('protects the previous state from changes to the returned state', () => {
            const newState = reducerUnderTest(previousState, testAction);

            expect(this.preserves(previousState, 'previous', newState)).toBe(true);
          });

          it('protects the initial state from changes to the returned state when there was a previous state', () => {
            const newState = reducerUnderTest(previousState, testAction);

            expect(this.preserves(initialState, 'initial', newState)).toBe(true);
          });

          it('protects the initial state from changes to the returned state when there was not a previous state', () => {
            const newState = reducerUnderTest(undefined, testAction);

            expect(this.preserves(initialState, 'initial', newState)).toBe(true);
          });
        });
      });
    });
  }

  private mockActionFrom(actionFactoryMethodName: string): any {
    return { actionFrom: actionFactoryMethodName };
  }

  private addInternalActionFactorySpyTo(section: any, methodName: string) {
    return section[methodName] =
      jasmine.createSpy(`'${methodName} internal action creator'`).and.returnValue(this.mockActionFrom(methodName));
  }

  private checkForEmittedValue(effect: Observable<Action>, effectName: string, inputAction: ParameterizedAction): void {
    const expectedExceptionMessage: string = 'Expected exception message';

    try {
      effect.take(1).subscribe(action => { throw new Error(expectedExceptionMessage); });
      this.simulateInputAction(inputAction);

      // Uh-oh.  We shouldn't have made it here because we threw an exception inside the subscription.
      fail(`Expected effect '${effectName}' to emit a value.
        1. Expecting it to have been triggered by an action with type '${inputAction.type}' -- was it?
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

  private simulateInputAction(inputAction: ParameterizedAction): void {
    this.mockNgrxEffectsActionSubject.next(inputAction);
  }

  private preserves(
    previousState: any,
    previousStateName: string,
    newState: any,
    propertyPath: string = 'state',
    previousStateSnapshot: string = JSON.stringify(previousState)
  ): boolean {
    if (Array.isArray(newState)) {
      return this.preservesArrayIn(previousState, previousStateName, newState, propertyPath, previousStateSnapshot);
    }

    if (newState === Object(newState)) {
      return this.preservesObjectIn(previousState, previousStateName, newState, propertyPath, previousStateSnapshot);
    }

    return this.preservesValueIn(previousState, previousStateName, newState, propertyPath, previousStateSnapshot);
  }

  private preservesArrayIn(
    previousState: any,
    previousStateName: string,
    array: any[],
    propertyPath: string,
    previousStateSnapshot: string
  ): boolean {
    array.push('evil mutation');

    this.verifyPreservationOf(previousState, previousStateSnapshot,
      `'${propertyPath}' array in the ${previousStateName} state is changed when pushing an element to it in the new state`);

    array.pop();

    for (const index in array) {
      if (!this.preserves(previousState, previousStateName, array[index], `${propertyPath}[${index}]`, previousStateSnapshot)) {
        return false;
      }
    }

    return true;
  }

  private preservesObjectIn(
    previousState: any,
    previousStateName: string,
    object: any,
    propertyPath: string,
    previousStateSnapshot: string
  ): boolean {
    object['evil mutation'] = 'evil mutation';

    this.verifyPreservationOf(previousState, previousStateSnapshot,
      `'${propertyPath}' object in the ${previousStateName} state is changed when adding a property to it in the new state`);

    delete object['evil mutation'];

    for (var key of Object.keys(object)) {
      if (!this.preserves(previousState, previousStateName, object[key], `${propertyPath}.${key}`, previousStateSnapshot)) {
        return false;
      }
    }

    return true;
  }

  private preservesValueIn(
    previousState: any,
    previousStateName: string,
    value: any,
    propertyPath: string,
    previousStateSnapshot: string
  ): boolean {
    const valueBeforeMutation = value;
    value = 'evil mutation';

    this.verifyPreservationOf(previousState, previousStateSnapshot,
      `'${propertyPath}' value in the ${previousStateName} state is changed when changing it in the new state`);

    value = valueBeforeMutation;

    return true;
  }

  private verifyPreservationOf(previousState: any, previousStateSnapshot: string, errorMessage: string) {
    if (JSON.stringify(previousState) !== previousStateSnapshot) throw new Error(errorMessage);
  }
}
