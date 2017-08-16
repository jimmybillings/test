import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MockAppStore } from './mock-app.store';

export interface ParameterizedAction extends Action {
  [parameterName: string]: any;
}

export interface EffectTestState {
  storeSectionName: string;
  propertyName?: string;
  value: any;
}

export interface EffectServiceMethod {
  name: string;
  expectedArguments?: any[];
  returnsObservableOf?: any;
  expectToHaveBeenCalled?: boolean;
}

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
  expectToEmitValue?: boolean;
}

export class EffectsSpecHelper {
  public mockNgrxEffectsActions: any;
  public mockStore: MockAppStore;
  public mockService: any;

  private mockNgrxEffectsActionSubject: Subject<ParameterizedAction>;

  constructor() {
    this.mockNgrxEffectsActionSubject = new Subject<ParameterizedAction>();
    this.mockNgrxEffectsActions = {
      ofType: (...types: string[]): Observable<Action> =>
        this.mockNgrxEffectsActionSubject.filter(action => types.some(type => type === action.type))
    };
    this.mockStore = new MockAppStore();
    this.mockService = {};
  }

  public generateStandardTestFor(parameters: EffectTestParameters): void {
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

    let internalActionFactoryMethod: jasmine.Spy;
    if (parameters.outputActionFactory) {
      internalActionFactoryMethod = this.mockStore.createInternalActionFactoryMethod(
        parameters.outputActionFactory.sectionName,
        parameters.outputActionFactory.methodName
      );
    }

    const effect: Observable<Action> = parameters.effectsInstantiator()[parameters.effectName];

    if (parameters.expectToEmitValue !== false) {
      this.checkForEmittedValue(effect, parameters.effectName, parameters.inputAction);
    }

    effect.take(1).subscribe((mappedAction: any) => {

      if (parameters.serviceMethod) {

        if (parameters.serviceMethod.expectToHaveBeenCalled !== false) {
          expect(this.mockService[parameters.serviceMethod.name])
            .toHaveBeenCalledWith(...parameters.serviceMethod.expectedArguments);
        }

        if (parameters.expectToEmitValue === false) {
          fail(`Expected effect '${parameters.effectName}' not to emit a value.`);
        }
      }

      expect(internalActionFactoryMethod).toHaveBeenCalledWith(...parameters.outputActionFactory.expectedArguments);
      expect(mappedAction).toEqual(this.mockStore.getActionCreatedBy(internalActionFactoryMethod));
    });

    if (parameters.serviceMethod && parameters.serviceMethod.expectToHaveBeenCalled === false) {
      expect(this.mockService[parameters.serviceMethod.name])
        .not.toHaveBeenCalled();
    }

    this.simulateInputAction(parameters.inputAction);
  }

  public generateCustomTestFor(parameters: EffectTestParameters, test: (action: Action) => void): void {
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

  private createMockStateInfoFrom(oneOrMoreStateParameters: EffectTestState | EffectTestState[]) {
    (Array.isArray(oneOrMoreStateParameters) ? oneOrMoreStateParameters : [oneOrMoreStateParameters])
      .forEach(stateParameter => {
        if (stateParameter.propertyName) {
          this.mockStore.createStateElement(stateParameter.storeSectionName, stateParameter.propertyName, stateParameter.value);
        } else {
          this.mockStore.createStateSection(stateParameter.storeSectionName, stateParameter.value);
        }
      });
  }

  private createMockServiceMethod(methodName: string, returnValue: any): void {
    this.mockService[methodName] = jasmine.createSpy(`'${methodName} service method'`).and.returnValue(returnValue);
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

  private simulateInputAction(inputAction: ParameterizedAction): void {
    this.mockNgrxEffectsActionSubject.next(inputAction);
  }
}
