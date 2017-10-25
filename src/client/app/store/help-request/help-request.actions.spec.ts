import { ActionFactory, InternalActionFactory } from './help-request.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Help Request Actions', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'showHelpRequest',
        parameters: ['asset_name']
      },
      expectedAction: {
        type: '[Help Request] Show Help Request',
        assetName: 'asset_name'
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'SubmitHelpRequest',
        parameters: ['abc-123']
      },
      expectedAction: {
        type: '[Help Request] Submit Help Request',
        formItems: 'abc-123'
      }
    });

  });
}
