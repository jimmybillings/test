import * as CmsState from './cms.state';
import * as CmsActions from './cms.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Cms Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: CmsActions,
      state: CmsState,
    });
  });
}
