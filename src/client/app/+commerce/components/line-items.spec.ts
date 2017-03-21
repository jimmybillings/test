import { LineItems } from './line-items';

export function main() {
  describe('Line Items', () => {
    let classUnderTest: LineItems;

    beforeEach(() => {
      classUnderTest = new LineItems();
    });

    describe('moveTo()', () => {
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

        classUnderTest.moveTo(project, lineItem);
      });
    });

    describe('clone()', () => {
      it('emits the proper request event', () => {
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'CLONE_LINE_ITEM', payload: lineItem });
          });

        classUnderTest.clone(lineItem);
      });
    });

    describe('remove()', () => {
      it('emits the proper request event', () => {
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'REMOVE_LINE_ITEM', payload: lineItem });
          });

        classUnderTest.remove(lineItem);
      });
    });

    describe('editMarkers()', () => {
      it('emits the proper request event', () => {
        let lineItem: any = { some: 'lineItem' };
        classUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'EDIT_LINE_ITEM_MARKERS', payload: lineItem });
          });

        classUnderTest.editMarkers(lineItem);
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
      it('has no visible effect (yet)', () => {
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.selectLineItem(lineItem);

        expect(true).toBe(true);
      });
    });

    describe('showPricingDialog', () => {
      it('should emit the "SHOW_PRICING_DIALOG" event', () => {
        let lineItem: any = { some: 'lineItem' };

        classUnderTest.lineItemsNotify.subscribe((event: Object) => {
          expect(event).toEqual({ type: 'SHOW_PRICING_DIALOG', payload: lineItem });
        });

        classUnderTest.showPricingDialog(lineItem);
      });
    });

    describe('selectTarget', () => {
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

        classUnderTest.selectTarget('', 'master_copy', lineItem);
      });
    });
  });
}
