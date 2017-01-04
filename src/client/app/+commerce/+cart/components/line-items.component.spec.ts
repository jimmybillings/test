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
                  lineItem: lineItem, fieldToEdit: { selectedTranscodeTarget: '1080i' }
                }
              });
          });

        componentUnderTest.selectTarget({ name: '1080i', selected: false }, lineItem);
      });
    });

    describe('format', () => {
      it('formats the transcode targets properly - with selected', () => {
        let lineItem: any = {
          transcodeTargets: ['1080i', '1080p', 'master_copy'],
          selectedTranscodeTarget: 'master_copy'
        };
        let actualResult: Array<any> = componentUnderTest.format(lineItem);
        let expectedResult: Array<any> = [
          { name: '1080i', selected: false },
          { name: '1080p', selected: false },
          { name: 'master_copy', selected: true }
        ];

        expect(actualResult).toEqual(expectedResult);
      });

      it('sets the selectedTranscodeTarget', () => {
        let lineItem: any = {
          transcodeTargets: ['1080i', '1080p', 'master_copy'],
          selectedTranscodeTarget: 'master_copy'
        };
        componentUnderTest.format(lineItem);
        expect(componentUnderTest.selectedTranscodeTarget).toEqual({ name: 'master_copy', selected: true });
      });
    });
  });
};
