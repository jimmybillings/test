import { AssetShareLinkComponent } from './asset-share-link.component';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Asset Share Link Component', () => {
    let componentUnderTest: AssetShareLinkComponent;
    let mockStore: MockAppStore;

    beforeEach(() => {
      mockStore = new MockAppStore();
      componentUnderTest = new AssetShareLinkComponent(mockStore);
    });

    describe('onCopyShareLinkButtonClick()', () => {
      it('displays a snackbar with the expected message', () => {
        const snackbarSpy = mockStore.createActionFactoryMethod('snackbar', 'display');

        componentUnderTest.onCopyShareLinkButtonClick();

        expect(snackbarSpy).toHaveBeenCalledWith('ASSET.SHARING.SHARE_LINK.COPIED_CONFIRMED_MESSAGE');
      });
    });

  });
};

