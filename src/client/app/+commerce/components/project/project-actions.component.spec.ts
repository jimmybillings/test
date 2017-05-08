import { ProjectActionsComponent } from './project-actions.component';
import { AssetLineItem } from '../../../shared/interfaces/commerce.interface';
export function main() {
  describe('Project Actions Component', () => {

    const mockLineItem: AssetLineItem = {
      id: '456',
      price: 0,
      rightsManaged: 'Rights Managed'
    };

    const mockLineItemB: AssetLineItem = {
      id: '789',
      attributes: [],
      price: 0,
      rightsManaged: 'Royalty Free'
    };

    let componentUnderTest: ProjectActionsComponent;


    beforeEach(() => {
      componentUnderTest = new ProjectActionsComponent();
      componentUnderTest.edit.emit = jasmine.createSpy('edit emitter');
      componentUnderTest.remove.emit = jasmine.createSpy('remove emitter');
      componentUnderTest.addFee.emit = jasmine.createSpy('addFee emitter');
    });

    describe('onEditButtonClick()', () => {
      it('emits an edit request', () => {
        componentUnderTest.onEditButtonClick();
        expect(componentUnderTest.edit.emit).toHaveBeenCalled();
      });
    });

    describe('onRemoveButtonClick()', () => {
      it('emits an remove request', () => {
        componentUnderTest.onRemoveButtonClick();
        expect(componentUnderTest.remove.emit).toHaveBeenCalled();
      });
    });

    describe('onAddFeeButtonClick()', () => {
      it('emits an addFee request', () => {
        componentUnderTest.onAddFeeButtonClick();
        expect(componentUnderTest.addFee.emit).toHaveBeenCalled();
      });
    });

    describe('rmAssetsHaveAttributes()', () => {
      it('returns false when any lineItems are missing their price attributes', () => {
        componentUnderTest.items = [mockLineItem, mockLineItemB];
        expect(componentUnderTest.rmAssetsHaveAttributes).toBe(false);
      });
      it('returns true when all lineItems have price attributes', () => {
        componentUnderTest.items = [mockLineItemB];
        expect(componentUnderTest.rmAssetsHaveAttributes).toBe(true);
      });
    });
    describe('projectHasRmAssets()', () => {
      it('returns true when at least one lineItem is a rights manage asset', () => {
        componentUnderTest.items = [mockLineItem, mockLineItemB];
        expect(componentUnderTest.projectHasRmAssets).toBe(true);
      });
      it('returns false when no lineItems are rights managed', () => {
        componentUnderTest.items = [mockLineItemB];
        expect(componentUnderTest.projectHasRmAssets).toBe(false);
      });
      it('returns false when no there are no lineItems', () => {
        componentUnderTest.items = [];
        expect(componentUnderTest.projectHasRmAssets).toBe(false);
      });
    });
  });
}
