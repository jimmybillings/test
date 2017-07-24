import { AdministerQuoteComponent } from './administer-quote.component';

export function main() {
  describe('Administer Quote Component', () => {
    let componentUnderTest: AdministerQuoteComponent;

    beforeEach(() => {
      componentUnderTest = new AdministerQuoteComponent();
      componentUnderTest.userCanProceed = false;
    });

    describe('canOpenQuoteDialog', () => {
      it('Should emit the onSaveAndNew event', () => {
        expect(componentUnderTest.canOpenQuoteDialog).toEqual(false);
      });
    });

    describe('onSaveAndNew()', () => {
      it('Should emit the onSaveAndNew event', () => {
        spyOn(componentUnderTest.saveAndNew, 'emit');
        componentUnderTest.onSaveAndNew();

        expect(componentUnderTest.saveAndNew.emit).toHaveBeenCalled();

      });
    });

    describe('onOpenDeleteDialog()', () => {
      it('Should emit the openDeleteDialog event', () => {
        spyOn(componentUnderTest.openDeleteDialog, 'emit');
        componentUnderTest.onOpenDeleteDialog();

        expect(componentUnderTest.openDeleteDialog.emit).toHaveBeenCalled();

      });
    });

    describe('onOpenQuoteDialog()', () => {
      it('Should emit the openQuoteDialog event', () => {
        spyOn(componentUnderTest.openQuoteDialog, 'emit');
        componentUnderTest.onOpenQuoteDialog();

        expect(componentUnderTest.openQuoteDialog.emit).toHaveBeenCalled();

      });
    });

    describe('onSaveAsDraft()', () => {
      it('Should emit the saveAsDraft event', () => {
        spyOn(componentUnderTest.saveAsDraft, 'emit');
        componentUnderTest.onSaveAsDraft();

        expect(componentUnderTest.saveAsDraft.emit).toHaveBeenCalled();

      });
    });

    describe('onCloneQuote()', () => {
      it('Should emit the saveAsDraft event', () => {
        spyOn(componentUnderTest.cloneQuote, 'emit');
        componentUnderTest.onClickCloneQuoteButton();

        expect(componentUnderTest.cloneQuote.emit).toHaveBeenCalled();

      });
    });
  });
}
