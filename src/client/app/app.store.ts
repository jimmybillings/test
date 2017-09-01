import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, Action } from '@ngrx/store';

import * as ActiveCollectionActions from './store/actions/active-collection.actions';
import * as ActiveCollectionState from './store/states/active-collection.state';
export type ActiveCollectionState = ActiveCollectionState.State;

import * as AssetActions from './store/actions/asset.actions';
import * as AssetState from './store/states/asset.state';
export type AssetState = AssetState.State;

import * as CommentActions from './store/actions/comment.actions';
import * as CommentState from './store/states/comment.state';
export type CommentState = CommentState.State;

import * as DialogActions from './store/actions/dialog.actions';

import * as ErrorActions from './store/actions/error.actions';

import * as NotifierActions from './store/actions/notifier.actions';

import * as OrderActions from './store/actions/order.actions';
import * as OrderState from './store/states/order.state';
export type OrderState = OrderState.State;

import * as RouterActions from './store/actions/router.actions';

import * as SnackbarActions from './store/actions/snackbar.actions';
import * as SnackbarState from './store/states/snackbar.state';
export type SnackbarState = SnackbarState.State;

import * as SpeedPreviewActions from './store/actions/speed-preview.actions';
import * as SpeedPreviewState from './store/states/speed-preview.state';
export type SpeedPreviewState = SpeedPreviewState.State;

export interface ActionFactory {
  readonly activeCollection: ActiveCollectionActions.ActionFactory;
  readonly asset: AssetActions.ActionFactory;
  readonly comment: CommentActions.ActionFactory;
  readonly dialog: DialogActions.ActionFactory;
  readonly error: ErrorActions.ActionFactory;
  readonly order: OrderActions.ActionFactory;
  readonly router: RouterActions.ActionFactory;
  readonly notifier: NotifierActions.ActionFactory;
  readonly snackbar: SnackbarActions.ActionFactory;
  readonly speedPreview: SpeedPreviewActions.ActionFactory;
};

export interface InternalActionFactory {
  readonly activeCollection: ActiveCollectionActions.InternalActionFactory;
  readonly asset: AssetActions.InternalActionFactory;
  readonly comment: CommentActions.InternalActionFactory;
  readonly dialog: DialogActions.InternalActionFactory;
  readonly error: ErrorActions.InternalActionFactory;
  readonly notifier: NotifierActions.InternalActionFactory;
  readonly order: OrderActions.InternalActionFactory;
  readonly router: RouterActions.InternalActionFactory;
  readonly snackbar: SnackbarActions.InternalActionFactory;
  readonly speedPreview: SpeedPreviewActions.InternalActionFactory;
};

export interface AppState {
  readonly activeCollection: ActiveCollectionState;
  readonly asset: AssetState;
  readonly order: OrderState;
  readonly snackbar: SnackbarState;
  readonly speedPreview: SpeedPreviewState;
  readonly comment: CommentState;
}

export interface AppReducers {
  readonly [reducerName: string]: Function;
};

// NOTE:  Until all the old legacy reducers are replaced, you must ALSO redefine these directly in shared.module.ts.
export const reducers: AppReducers = {
  activeCollection: ActiveCollectionState.reducer,
  asset: AssetState.reducer,
  order: OrderState.reducer,
  snackbar: SnackbarState.reducer,
  speedPreview: SpeedPreviewState.reducer,
  comment: CommentState.reducer
};

export type ActionFactoryMapper = (factory: ActionFactory) => Action;
export type InternalActionFactoryMapper = (factory: InternalActionFactory) => Action;
export type StateMapper<T> = (state: AppState) => T;

@Injectable()
export class AppStore {
  private readonly actionFactory: ActionFactory = {
    activeCollection: new ActiveCollectionActions.ActionFactory(),
    asset: new AssetActions.ActionFactory(),
    comment: new CommentActions.ActionFactory(),
    dialog: new DialogActions.ActionFactory(),
    error: new ErrorActions.ActionFactory(),
    notifier: new NotifierActions.ActionFactory(),
    order: new OrderActions.ActionFactory(),
    router: new RouterActions.ActionFactory(),
    snackbar: new SnackbarActions.ActionFactory(),
    speedPreview: new SpeedPreviewActions.ActionFactory()
  };

  private readonly internalActionFactory: InternalActionFactory = {
    activeCollection: new ActiveCollectionActions.InternalActionFactory(),
    asset: new AssetActions.InternalActionFactory(),
    comment: new CommentActions.InternalActionFactory(),
    dialog: new DialogActions.InternalActionFactory(),
    error: new ErrorActions.InternalActionFactory(),
    notifier: new NotifierActions.InternalActionFactory(),
    order: new OrderActions.InternalActionFactory(),
    router: new RouterActions.InternalActionFactory(),
    snackbar: new SnackbarActions.InternalActionFactory(),
    speedPreview: new SpeedPreviewActions.InternalActionFactory()
  };

  constructor(private ngrxStore: Store<AppState>) { }

  public dispatch(actionFactoryMapper: ActionFactoryMapper): void {
    this.ngrxStore.dispatch(actionFactoryMapper(this.actionFactory));
  }

  public create(internalActionFactoryMapper: InternalActionFactoryMapper): Action {
    return internalActionFactoryMapper(this.internalActionFactory);
  }

  public select<T>(stateMapper: StateMapper<T>): Observable<T> {
    return this.ngrxStore.select(stateMapper);
  }

  public snapshot<T>(stateMapper: StateMapper<T>): T {
    let snapshot: T;
    this.select(stateMapper).take(1).subscribe((latest: T) => snapshot = latest);
    return snapshot;
  }

  public completeSnapshot(): AppState {
    return this.snapshot(state => state);
  }

  public match<T>(value: T, stateMapper: StateMapper<T>): boolean {
    return value === this.snapshot(stateMapper);
  }

  public blockUntil(stateMapper: StateMapper<boolean>): Observable<boolean> {
    return this.select(stateMapper).filter((selectedValue: boolean) => selectedValue).take(1);
  }

  public blockUntilMatch<T>(value: T, stateMapper: StateMapper<T>): Observable<null> {
    return this.select(stateMapper).filter((selectedValue: T) => value === selectedValue).take(1).map((value: T) => null);
  }
}
