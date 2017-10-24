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
  private _ngrxDispatch: jasmine.Spy;
  private _actionFactory: MockActionFactory;
  private _internalActionFactory: MockInternalActionFactory;
  private _state: MockAppState;

  constructor() {
    super(null);

    this._actionFactory = {
      activeCollection: {} as any,
      // activeCollectionAsset: {} as any,
      asset: {} as any,
      cart: {} as any,
      // cartAsset: {} as any,
      comment: {} as any,
      deliveryOptions: {} as any,
      dialog: {} as any,
      error: {} as any,
      headerDisplayOptions: {} as any,
      loadingIndicator: {} as any,
      multiLingual: {} as any,
      notifier: {} as any,
      order: {} as any,
      // orderAsset: {} as any,
      quoteEdit: {} as any,
      // quoteEditAsset: {} as any,
      quoteShow: {} as any,
      // quoteShowAsset: {} as any,
      router: {} as any,
      // searchAsset: {} as any,
      snackbar: {} as any,
      speedPreview: {} as any,
      uiConfig: {} as any
    };

    this._internalActionFactory = {
      activeCollection: {} as any,
      // activeCollectionAsset: {} as any,
      asset: {} as any,
      cart: {} as any,
      // cartAsset: {} as any,
      comment: {} as any,
      deliveryOptions: {} as any,
      dialog: {} as any,
      error: {} as any,
      headerDisplayOptions: {} as any,
      loadingIndicator: {} as any,
      multiLingual: {} as any,
      notifier: {} as any,
      order: {} as any,
      // orderAsset: {} as any,
      quoteEdit: {} as any,
      // quoteEditAsset: {} as any,
      quoteShow: {} as any,
      // quoteShowAsset: {} as any,
      router: {} as any,
      // searchAsset: {} as any,
      snackbar: {} as any,
      speedPreview: {} as any,
      uiConfig: {} as any
    };

    this._state = {
      activeCollection: {} as any,
      // activeCollectionAsset: {} as any,
      asset: {} as any,
      cart: {} as any,
      // cartAsset: {} as any,
      comment: {} as any,
      deliveryOptions: {} as any,
      headerDisplayOptions: {} as any,
      loadingIndicator: {} as any,
      multiLingual: {} as any,
      order: {} as any,
      // orderAsset: {} as any,
      quoteEdit: {} as any,
      // quoteEditAsset: {} as any,
      quoteShow: {} as any,
      // quoteShowAsset: {} as any,
      // searchAsset: {} as any,
      snackbar: {} as any,
      speedPreview: {} as any,
      uiConfig: {} as any
    };

    this._ngrxDispatch = jasmine.createSpy('ngrx dispatch');

    spyOn(this, 'dispatch').and.callFake((actionFactoryMapper: ActionFactoryMapper) => {
      this._ngrxDispatch(actionFactoryMapper(this._actionFactory));
    });

    spyOn(this, 'create').and.callFake((internalActionFactoryMapper: InternalActionFactoryMapper) =>
      internalActionFactoryMapper(this._internalActionFactory)
    );

    spyOn(this, 'select').and.callFake((stateMapper: StateMapper<any>) => {
      try { return Observable.of(stateMapper(this._state)); } catch (exception) { return Observable.empty(); };
    });

    spyOn(this, 'snapshot').and.callFake((stateMapper: StateMapper<any>) =>
      stateMapper(this._state)
    );

    spyOn(this, 'selectCloned').and.callFake((stateMapper: StateMapper<any>) => {
      try { return Observable.of(stateMapper(this._state)); } catch (exception) { return Observable.empty(); };
    });

    spyOn(this, 'snapshotCloned').and.callFake((stateMapper: StateMapper<any>) =>
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

    spyOn(this, 'blockUntilMatch').and.callFake((value: any, stateMapper: StateMapper<any>) =>
      stateMapper(this._state) === value ? Observable.of(null) : Observable.empty()
    );
  }

  public createStateSection(stateSectionName: string, value: any): void {
    this._state[stateSectionName] = value;
  }

  public createStateElement(stateSectionName: string, elementName: string, value: any): void {
    this._state[stateSectionName][elementName] = value;
  }

  public createActionFactoryMethod(sectionName: string, methodName: string): jasmine.Spy {
    if (!this._actionFactory.hasOwnProperty(sectionName)) {
      throw new Error(`Section '${sectionName}' does not exist in the ActionFactory`);
    }
    return this._actionFactory[sectionName][methodName] =
      jasmine.createSpy(`'${sectionName}.${methodName} action creator'`)
        .and.returnValue(this.mockActionFrom(sectionName, methodName));
  }

  public createInternalActionFactoryMethod(sectionName: string, methodName: string): jasmine.Spy {
    if (!this._internalActionFactory.hasOwnProperty(sectionName)) {
      throw new Error(`Section '${sectionName}' does not exist in the InternalActionFactory`);
    }
    return this._internalActionFactory[sectionName][methodName] =
      jasmine.createSpy(`'${sectionName}.${methodName} internal action creator'`)
        .and.returnValue(this.mockActionFrom(sectionName, methodName));
  }

  public expectDispatchFor(actionFactoryMethod: jasmine.Spy, ...expectedParameters: any[]): void {
    expect(actionFactoryMethod).toHaveBeenCalledWith(...expectedParameters);
    expect(this._ngrxDispatch).toHaveBeenCalledWith(this.getActionCreatedBy(actionFactoryMethod));
  }

  public expectNoDispatchFor(actionFactoryMethod: jasmine.Spy): void {
    expect(this._ngrxDispatch).not.toHaveBeenCalledWith(this.getActionCreatedBy(actionFactoryMethod));
  }

  public getActionCreatedBy(actionFactoryMethod: jasmine.Spy): any {
    return { actionFrom: actionFactoryMethod.and.identity().replace('\'', '').split(' ')[0] };
  }

  private mockActionFrom(actionFactorySectionName: string, actionFactoryMethodName: string): any {
    return { actionFrom: `${actionFactorySectionName}.${actionFactoryMethodName}` };
  }
}
