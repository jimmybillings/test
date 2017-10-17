import { ActionFactory, InternalActionFactory } from './speed-preview.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Speed Preview Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: [{ asset: 'test asset' }]
      },
      expectedAction: {
        type: '[SpeedPreview] Load',
        asset: { asset: 'test asset' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadSuccess',
        parameters: [{ 'speedViewData': 'test speed view data' }]
      },
      expectedAction: {
        type: '[SpeedPreview] Load Success',
        speedViewData: { 'speedViewData': 'test speed view data' }
      }
    });
  });
}

