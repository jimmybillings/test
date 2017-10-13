import * as MultiLingualState from './multi-lingual.state';
import * as MultiLingualActions from '../actions/multi-lingual.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Multilingual Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      state: MultiLingualState,
      actions: MultiLingualActions
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'SetLanguage',
      customTests: [
        {
          it: 'returns the state with a correct language code',
          actionParameters: { lang: 'en' },
          previousState: MultiLingualState.initialState,
          expectedNextState: { ...MultiLingualState.initialState, lang: 'en' }
        }
      ]
    });

  });
}
