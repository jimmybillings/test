import { LineItemsComponent } from './line-items.component';
import * as EnhancedMock from '../../../shared/interfaces/enhanced-asset';
import { mockCommerceAssetLineItem } from '../../../shared/mocks/mock-asset';

export function main() {
  describe('Line Items', () => {
    let classUnderTest: LineItemsComponent;
    let mockEnhancedAsset: EnhancedMock.EnhancedAsset;

    beforeEach(() => {
      mockEnhancedAsset = EnhancedMock.enhanceAsset(mockCommerceAssetLineItem.asset);
      classUnderTest = new LineItemsComponent();
      classUnderTest.lineItems = [mockCommerceAssetLineItem];
    });

    describe('onMoveTo()', () => {
      it('emits the proper request event', () => {
        let project: any = { some: 'project' };
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({
              type: 'MOVE_LINE_ITEM',
              payload: { lineItem: lineItem, otherProject: project }
            });
          });

        classUnderTest.onMoveTo(project, lineItem);
      });
    });

    describe('onClone()', () => {
      it('emits the proper request event', () => {
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'CLONE_LINE_ITEM', payload: lineItem });
          });

        classUnderTest.onClone(lineItem);
      });
    });

    describe('remove()', () => {
      it('emits the proper request event', () => {
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'REMOVE_LINE_ITEM', payload: lineItem });
          });

        classUnderTest.onRemove(lineItem);
      });
    });

    describe('editMarkers()', () => {
      it('emits the proper request event', () => {
        let lineItem: any = { some: 'lineItem' };
        classUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'EDIT_LINE_ITEM_MARKERS', payload: lineItem });
          });

        classUnderTest.onEditMarkers(lineItem);
      });
    });

    describe('delegate()', () => {
      it('forwards events', () => {
        classUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ some: 'event' });
          });

        classUnderTest.delegate({ some: 'event' });
      });
    });

    describe('selectLineItem()', () => {
      it('has no testable effect (yet)', () => {
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.selectLineItem(lineItem);

        expect(true).toBe(true);
      });
    });

    describe('onShowPricingDialog', () => {
      it('should emit the "SHOW_PRICING_DIALOG" event', () => {
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.lineItemsNotify.subscribe((event: Object) => {
          expect(event).toEqual({ type: 'SHOW_PRICING_DIALOG', payload: lineItem });
        });

        classUnderTest.onShowPricingDialog(lineItem);
      });
    });

    describe('onSelectTarget', () => {
      it('emits the proper event', () => {
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual(
              {
                type: 'EDIT_LINE_ITEM', payload: {
                  lineItem: lineItem, fieldToEdit: { selectedTranscodeTarget: 'master_copy' }
                }
              });
          });

        classUnderTest.onSelectTarget('master_copy', '', lineItem);
      });
    });

    describe('onAddCostMultiplier()', () => {
      it('emits the proper event with the lineItem', () => {
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.lineItemsNotify.subscribe((event: Object) => {
          expect(event).toEqual({ type: 'SHOW_COST_MULTIPLIER_DIALOG', payload: lineItem });
        });

        classUnderTest.onOpenCostMultiplierForm(lineItem);
      });
    });

    describe('onRemoveCostMultiplier', () => {
      it('emits the proper event with the lineItem', () => {
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.lineItemsNotify.subscribe((event: Object) => {
          expect(event).toEqual({ type: 'REMOVE_COST_MULTIPLIER', payload: lineItem });
        });

        classUnderTest.onRemoveCostMultiplier(lineItem);
      });
    });

    describe('isSubclipped()', () => {
      it('returns true when the enhanced asset is subclipped', () => {
        expect(classUnderTest.isSubclipped(classUnderTest.items[0])).toBe(mockEnhancedAsset.isSubclipped);
      });
    });
  });
}
