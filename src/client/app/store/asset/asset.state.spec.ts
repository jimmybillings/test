import * as AssetActions from './asset.actions';
import * as SearchAssetActions from '../search-asset/search-asset.actions';
import * as QuoteEditAssetActions from '../quote-edit-asset/quote-edit-asset.actions';
import * as QuoteShowAssetActions from '../quote-show-asset/quote-show-asset.actions';
import * as CartAssetActions from '../cart-asset/cart-asset.actions';
import * as ActiveCollectionAssetActions from '../active-collection-asset/active-collection-asset.actions';

import * as AssetState from './asset.state';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Asset Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: AssetActions,
      state: AssetState,
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadDeliveryOptions',
      mutationTestData: {
        previousState: AssetState.initialState
      },
      customTests: [
        {
          it: 'returns the state but with loading: true',
          previousState: AssetState.initialState,
          expectedNextState: { ...AssetState.initialState, loading: true }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadDeliveryOptionsSuccess',
      mutationTestData: {
        previousState: { hasDeliveryOptions: false, options: [], loading: true },
        actionParameters: { options: [{ some: 'options' }] }
      },
      customTests: [
        {
          it: 'returns the right state when there are delivery options',
          previousState: { hasDeliveryOptions: false, options: [], loading: true },
          actionParameters: { options: [{ some: 'options' }] },
          expectedNextState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false }
        },
        {
          it: 'returns the right state when there are NO delivery options',
          previousState: { hasDeliveryOptions: false, options: [], loading: true },
          actionParameters: { options: [] },
          expectedNextState: { hasDeliveryOptions: false, options: [], loading: false }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      overrideActionClass: SearchAssetActions,
      mutationTestData: {
        previousState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false }
      },
      customTests: [
        {
          it: 'returns the initial state',
          previousState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false },
          expectedNextState: AssetState.initialState
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      overrideActionClass: ActiveCollectionAssetActions,
      mutationTestData: {
        previousState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false }
      },
      customTests: [
        {
          it: 'returns the initial state',
          previousState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false },
          expectedNextState: AssetState.initialState
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      overrideActionClass: QuoteShowAssetActions,
      mutationTestData: {
        previousState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false }
      },
      customTests: [
        {
          it: 'returns the initial state',
          previousState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false },
          expectedNextState: AssetState.initialState
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      overrideActionClass: QuoteEditAssetActions,
      mutationTestData: {
        previousState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false }
      },
      customTests: [
        {
          it: 'returns the initial state',
          previousState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false },
          expectedNextState: AssetState.initialState
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      overrideActionClass: CartAssetActions,
      mutationTestData: {
        previousState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false }
      },
      customTests: [
        {
          it: 'returns the initial state',
          previousState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false },
          expectedNextState: AssetState.initialState
        }
      ]
    });
  });
}
