import { InternalActionFactoryMapper } from '../../app.store';
import { ActionFactory, InternalActionFactory } from './sharing.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Sharing Actions', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'createAssetShareLink',
        parameters: [1, { markers: 'some markers' }]
      },
      expectedAction: {
        type: '[Sharing] Create Asset Share Link',
        assetId: 1,
        markers: { markers: 'some markers' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'emailAssetShareLink',
        parameters: [1, { markers: 'some markers' }, { parameters: 'some paramaters' }]
      },
      expectedAction: {
        type: '[Sharing] Email Asset Share Link',
        assetId: 1,
        markers: { markers: 'some markers' },
        parameters: { parameters: 'some paramaters' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'emailCollectionShareLink',
        parameters: [1, { parameters: 'some paramaters' }]
      },
      expectedAction: {
        type: '[Sharing] Email Collection Share Link',
        collectionId: 1,
        parameters: { parameters: 'some paramaters' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'createAssetShareLinkSuccess',
        parameters: ['someLink']
      },
      expectedAction: {
        type: '[Sharing] Create Asset Share Link Success',
        link: 'someLink'
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'emailCollectionShareLinkSuccess',
        parameters: [],
      },
      expectedAction: {
        type: '[Sharing] Email Collection Share Link Success'
      }
    });
  });
}
