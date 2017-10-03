import { LineItemsComponent } from './line-items.component';
import * as EnhancedMock from '../../../shared/interfaces/enhanced-asset';
import { mockCommerceAssetLineItem } from '../../../shared/mocks/mock-asset';

export function main() {
  describe('Line Items', () => {
    let classUnderTest: LineItemsComponent;
    let mockEnhancedAsset: EnhancedMock.EnhancedAsset;

    beforeEach(() => {
      mockEnhancedAsset = EnhancedMock.enhanceAsset(mockCommerceAssetLineItem.asset, null);
      classUnderTest = new LineItemsComponent();
      mockCommerceAssetLineItem.asset = EnhancedMock.enhanceAsset(mockCommerceAssetLineItem.asset, null);
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
        expect(classUnderTest.isSubclipped(classUnderTest.items[0].asset as EnhancedMock.EnhancedAsset))
          .toBe(mockEnhancedAsset.isSubclipped);
      });
    });

    describe('shouldDisplayPricing()', () => {
      it('returns true when quote is NOT a ProvisionalOrder', () => {
        classUnderTest.quoteType = 'OfflineAgreement';
        expect(classUnderTest.shouldDisplayPricing)
          .toBe(true);
      });
      it('returns false when the quote is a ProvisionalOrder', () => {
        classUnderTest.quoteType = 'ProvisionalOrder';
        expect(classUnderTest.shouldDisplayPricing)
          .toBe(false);
      });
    });
    describe('shouldShowTargets()', () => {
      it('returns true when transcodeTargets exist and have a length greater than 0', () => {
        let lineItem: any = { transcodeTargets: ['native', '10mbH264', 'xconvert_prores_hd'] };
        expect(classUnderTest.shouldShowTargets(lineItem))
          .toBe(true);
      });
      it('returns false when transcodeTargets exist, but have a zero length', () => {
        let lineItem: any = { transcodeTargets: [] };
        expect(classUnderTest.shouldShowTargets(lineItem))
          .toBe(false);
      });
    });

    describe('shouldDisplayRights()', () => {
      it('returns true when the line item is rights managed and quote is NOT a ProvisionalOrder', () => {
        let lineItem: any = { rightsManaged: 'Rights Managed' };
        classUnderTest.quoteType = 'OfflineAgreement';
        expect(classUnderTest.shouldDisplayRights(lineItem))
          .toBe(true);
      });
      it('returns false when the line item is royalty-free', () => {
        let lineItem: any = { rightsManaged: 'Royalty Free' };
        expect(classUnderTest.shouldDisplayRights(lineItem))
          .toBe(false);
      });
      it('returns false when the quote is a ProvisionalOrder', () => {
        let lineItem: any = { rightsManaged: 'Rights Managed' };
        classUnderTest.quoteType = 'ProvisionalOrder';
        expect(classUnderTest.shouldDisplayRights(lineItem))
          .toBe(false);
      });
    });

    describe('onAddCustomPrice()', () => {
      it('emits the lineItemsNotify event with the right type and payload', () => {
        classUnderTest.onAddCustomPrice({ some: 'lineItem' } as any);

        classUnderTest.lineItemsNotify.subscribe((event: any) => {
          expect(event).toEqual({ type: 'ADD_CUSTOM_PRICE', payload: { some: 'lineItem' } });
        });
      });
    });
  });
}
