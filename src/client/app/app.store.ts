import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, Action } from '@ngrx/store';
import { Common } from './shared/utilities/common.functions';

import * as ActiveCollectionActions from './store/active-collection/active-collection.actions';
import * as ActiveCollectionState from './store/active-collection/active-collection.state';
export type ActiveCollectionState = ActiveCollectionState.State;

import * as AssetActions from './store/asset/asset.actions';
import * as AssetState from './store/asset/asset.state';
export type AssetState = AssetState.State;

import * as CartActions from './store/cart/cart.actions';
import * as CartState from './store/cart/cart.state';
export type CartState = CartState.State;

import * as CommentActions from './store/comment/comment.actions';
import * as CommentState from './store/comment/comment.state';
export type CommentState = CommentState.State;

import * as DeliveryOptionsActions from './store/delivery-options/delivery-options.actions';
import * as DeliveryOptionsState from './store/delivery-options/delivery-options.state';
export type DeliveryOptionsState = DeliveryOptionsState.State;

import * as DialogActions from './store/dialog/dialog.actions';

import * as ErrorActions from './store/error/error.actions';

import * as HeaderDisplayOptionsActions from './store/header-display-options/header-display-options.actions';
import * as HeaderDisplayOptionsState from './store/header-display-options/header-display-options.state';
export type HeaderDisplayOptionsState = HeaderDisplayOptionsState.State;

import * as NotifierActions from './store/notifier/notifier.actions';

import * as LoadingIndicatorActions from './store/loading-indicator/loading-indicator.actions';
import * as LoadingIndicatorState from './store/loading-indicator/loading-indicator.state';
export type LoadingIndicatorState = LoadingIndicatorState.State;

import * as OrderActions from './store/order/order.actions';
import * as OrderState from './store/order/order.state';
export type OrderState = OrderState.State;

import * as QuoteEditActions from './store/quote-edit/quote-edit.actions';
import * as QuoteEditState from './store/quote-edit/quote-edit.state';
export type QuoteEditState = QuoteEditState.State;

import * as QuoteShowActions from './store/quote-show/quote-show.actions';
import * as QuoteShowState from './store/quote-show/quote-show.state';
export type QuoteShowState = QuoteShowState.State;

import * as RouterActions from './store/router/router.actions';

import * as SnackbarActions from './store/snackbar/snackbar.actions';
import * as SnackbarState from './store/snackbar/snackbar.state';
export type SnackbarState = SnackbarState.State;

import * as SpeedPreviewActions from './store/speed-preview/speed-preview.actions';
import * as SpeedPreviewState from './store/speed-preview/speed-preview.state';
export type SpeedPreviewState = SpeedPreviewState.State;

import * as UiConfigActions from './store/ui-config/ui-config.actions';
import * as UiConfigState from './store/ui-config/ui-config.state';
export type UiConfigState = UiConfigState.State;

import * as MultiLingualActions from './store/multi-lingual/multi-lingual.actions';
import * as MultiLingualState from './store/multi-lingual/multi-lingual.state';
export type MultiLingualState = MultiLingualState.State;

import * as HelpRequestActions from './store/help-request/help-request.actions';

export interface ActionFactory {
  readonly activeCollection: ActiveCollectionActions.ActionFactory;
  readonly asset: AssetActions.ActionFactory;
  readonly cart: CartActions.ActionFactory;
  readonly comment: CommentActions.ActionFactory;
  readonly deliveryOptions: DeliveryOptionsActions.ActionFactory;
  readonly dialog: DialogActions.ActionFactory;
  readonly error: ErrorActions.ActionFactory;
  readonly headerDisplayOptions: HeaderDisplayOptionsActions.ActionFactory;
  readonly loadingIndicator: LoadingIndicatorActions.ActionFactory;
  readonly multiLingual: MultiLingualActions.ActionFactory;
  readonly helpRequest: HelpRequestActions.ActionFactory;
  readonly order: OrderActions.ActionFactory;
  readonly quoteEdit: QuoteEditActions.ActionFactory;
  readonly quoteShow: QuoteShowActions.ActionFactory;
  readonly router: RouterActions.ActionFactory;
  readonly notifier: NotifierActions.ActionFactory;
  readonly snackbar: SnackbarActions.ActionFactory;
  readonly speedPreview: SpeedPreviewActions.ActionFactory;
  readonly uiConfig: UiConfigActions.ActionFactory;
};

export interface InternalActionFactory {
  readonly activeCollection: ActiveCollectionActions.InternalActionFactory;
  readonly asset: AssetActions.InternalActionFactory;
  readonly cart: CartActions.InternalActionFactory;
  readonly comment: CommentActions.InternalActionFactory;
  readonly deliveryOptions: DeliveryOptionsActions.InternalActionFactory;
  readonly dialog: DialogActions.InternalActionFactory;
  readonly error: ErrorActions.InternalActionFactory;
  readonly headerDisplayOptions: HeaderDisplayOptionsActions.InternalActionFactory;
  readonly loadingIndicator: LoadingIndicatorActions.InternalActionFactory;
  readonly multiLingual: MultiLingualActions.InternalActionFactory;
  readonly helpRequest: HelpRequestActions.InternalActionFactory;
  readonly notifier: NotifierActions.InternalActionFactory;
  readonly order: OrderActions.InternalActionFactory;
  readonly quoteEdit: QuoteEditActions.InternalActionFactory;
  readonly quoteShow: QuoteShowActions.InternalActionFactory;
  readonly router: RouterActions.InternalActionFactory;
  readonly snackbar: SnackbarActions.InternalActionFactory;
  readonly speedPreview: SpeedPreviewActions.InternalActionFactory;
  readonly uiConfig: UiConfigActions.InternalActionFactory;
};

export interface AppState {
  readonly activeCollection: ActiveCollectionState;
  readonly asset: AssetState;
  readonly cart: CartState;
  readonly comment: CommentState;
  readonly deliveryOptions: DeliveryOptionsState;
  readonly headerDisplayOptions: HeaderDisplayOptionsState;
  readonly loadingIndicator: LoadingIndicatorState;
  readonly multiLingual: MultiLingualState;
  readonly order: OrderState;
  readonly quoteEdit: QuoteEditState;
  readonly quoteShow: QuoteShowState;
  readonly snackbar: SnackbarState;
  readonly speedPreview: SpeedPreviewState;
  readonly uiConfig: UiConfigState;
}

export interface AppReducers {
  readonly [reducerName: string]: Function;
};

// NOTE:  Until all the old legacy reducers are replaced, you must ALSO redefine these directly in shared.module.ts.
export const reducers: AppReducers = {
  activeCollection: ActiveCollectionState.reducer,
  asset: AssetState.reducer,
  cart: CartState.reducer,
  comment: CommentState.reducer,
  deliveryOptions: DeliveryOptionsState.reducer,
  headerDisplayOptions: HeaderDisplayOptionsState.reducer,
  loadingIndicator: LoadingIndicatorState.reducer,
  order: OrderState.reducer,
  multiLingual: MultiLingualState.reducer,
  quoteEdit: QuoteEditState.reducer,
  quoteShow: QuoteShowState.reducer,
  snackbar: SnackbarState.reducer,
  speedPreview: SpeedPreviewState.reducer,
  uiConfig: UiConfigState.reducer
};

export type ActionFactoryMapper = (factory: ActionFactory) => Action;
export type InternalActionFactoryMapper = (factory: InternalActionFactory) => Action;
export type StateMapper<T> = (state: AppState) => T;

@Injectable()
export class AppStore {
  private readonly actionFactory: ActionFactory = {
    activeCollection: new ActiveCollectionActions.ActionFactory(),
    asset: new AssetActions.ActionFactory(),
    cart: new CartActions.ActionFactory(),
    comment: new CommentActions.ActionFactory(),
    deliveryOptions: new DeliveryOptionsActions.ActionFactory(),
    dialog: new DialogActions.ActionFactory(),
    error: new ErrorActions.ActionFactory(),
    headerDisplayOptions: new HeaderDisplayOptionsActions.ActionFactory(),
    loadingIndicator: new LoadingIndicatorActions.ActionFactory(),
    multiLingual: new MultiLingualActions.ActionFactory(),
    helpRequest: new HelpRequestActions.ActionFactory(),
    notifier: new NotifierActions.ActionFactory(),
    order: new OrderActions.ActionFactory(),
    quoteEdit: new QuoteEditActions.ActionFactory(),
    quoteShow: new QuoteShowActions.ActionFactory(),
    router: new RouterActions.ActionFactory(),
    snackbar: new SnackbarActions.ActionFactory(),
    speedPreview: new SpeedPreviewActions.ActionFactory(),
    uiConfig: new UiConfigActions.ActionFactory()
  };

  private readonly internalActionFactory: InternalActionFactory = {
    activeCollection: new ActiveCollectionActions.InternalActionFactory(),
    asset: new AssetActions.InternalActionFactory(),
    cart: new CartActions.InternalActionFactory(),
    comment: new CommentActions.InternalActionFactory(),
    deliveryOptions: new DeliveryOptionsActions.InternalActionFactory(),
    dialog: new DialogActions.InternalActionFactory(),
    error: new ErrorActions.InternalActionFactory(),
    headerDisplayOptions: new HeaderDisplayOptionsActions.InternalActionFactory(),
    loadingIndicator: new LoadingIndicatorActions.InternalActionFactory(),
    multiLingual: new MultiLingualActions.InternalActionFactory(),
    helpRequest: new HelpRequestActions.InternalActionFactory(),
    notifier: new NotifierActions.InternalActionFactory(),
    order: new OrderActions.InternalActionFactory(),
    quoteEdit: new QuoteEditActions.InternalActionFactory(),
    quoteShow: new QuoteShowActions.InternalActionFactory(),
    router: new RouterActions.InternalActionFactory(),
    snackbar: new SnackbarActions.InternalActionFactory(),
    speedPreview: new SpeedPreviewActions.InternalActionFactory(),
    uiConfig: new UiConfigActions.InternalActionFactory()
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

  public selectCloned<T>(stateMapper: StateMapper<T>): Observable<T> {
    return this.ngrxStore.select(stateMapper).map(state => Common.clone(state));
  }

  public snapshotCloned<T>(stateMapper: StateMapper<T>): T {
    let snapshot: T;
    this.select(stateMapper).take(1).subscribe((latest: T) => snapshot = Common.clone(latest));
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
