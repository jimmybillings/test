import * as ActiveCollectionStore from './shared/future_stores/active-collection.store';
import * as AssetStore from './shared/future_stores/asset.store';

export interface State {
  activeCollection: ActiveCollectionStore.State;
  asset: AssetStore.State;
}

export const reducers: { [reducerName: string]: Function } = {
  activeCollection: ActiveCollectionStore.reducer,
  asset: AssetStore.reducer
};
