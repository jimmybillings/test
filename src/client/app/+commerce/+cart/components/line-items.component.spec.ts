import { LineItemsComponent } from './line-items.component';

export function main() {
  describe('Line Items Component', () => {
    let componentUnderTest: LineItemsComponent;

    beforeEach(() => {
      componentUnderTest = new LineItemsComponent();
    });

    describe('moveTo()', () => {
      it('emits the proper request event', () => {
        let project: any = { some: 'project' };
        let lineItem: any = { some: 'lineItem' };

        componentUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({
              type: 'MOVE_LINE_ITEM',
              payload: { lineItem: lineItem, otherProject: project }
            });
          });

        componentUnderTest.moveTo(project, lineItem);
      });
    });

    describe('clone()', () => {
      it('emits the proper request event', () => {
        let lineItem: any = { some: 'lineItem' };

        componentUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'CLONE_LINE_ITEM', payload: lineItem });
          });

        componentUnderTest.clone(lineItem);
      });
    });

    describe('remove()', () => {
      it('emits the proper request event', () => {
        let lineItem: any = { some: 'lineItem' };

        componentUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'REMOVE_LINE_ITEM', payload: lineItem });
          });

        componentUnderTest.remove(lineItem);
      });
    });

    describe('editMarkers()', () => {
      it('emits the proper request event', () => {
        let lineItem: any = { some: 'lineItem' };
        componentUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'EDIT_LINE_ITEM_MARKERS', payload: lineItem });
          });

        componentUnderTest.editMarkers(lineItem);
      });
    });

    describe('delegate()', () => {
      it('forwards events', () => {
        componentUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ some: 'event' });
          });

        componentUnderTest.delegate({ some: 'event' });
      });
    });

    describe('selectLineItem()', () => {
      it('has no visible effect (yet)', () => {
        let lineItem: any = { some: 'lineItem' };

        componentUnderTest.selectLineItem(lineItem);

        expect(true).toBe(true);
      });
    });

    describe('selectTarget', () => {
      it('emits the proper event', () => {
        let lineItem: any = { some: 'lineItem' };

        componentUnderTest.lineItemsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual(
              {
                type: 'EDIT_LINE_ITEM', payload: {
                  lineItem: lineItem, fieldToEdit: { selectedTranscodeTarget: 'master_copy' }
                }
              });
          });

        componentUnderTest.selectTarget('', 'master_copy', lineItem);
      });
    });
  });
};
