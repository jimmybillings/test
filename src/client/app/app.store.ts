import * as AssetStore from './shared/future_stores/asset.store';

export interface State {
  asset: AssetStore.State;
}

export const reducers: { [reducerName: string]: Function } = {
  asset: AssetStore.reducer
};
