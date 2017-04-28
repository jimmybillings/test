import { CommerceListComponent } from './commerce-list.component';

export function main() {
  describe('Commerce List Component', () => {
    let componentUnderTest: CommerceListComponent;

    beforeEach(() => {
      componentUnderTest = new CommerceListComponent();
    });

    describe('shouldShowSetFocusedButton', () => {
      it('Should return true if all conditions are met', () => {
        componentUnderTest.type = 'QUOTE';
        componentUnderTest.userCanAdministerQuotes = true;
        expect(componentUnderTest.shouldShowSetFocusedButton({ quoteStatus: 'PENDING' } as any)).toBe(true);
      });

      it('Should return false if the type is order', () => {
        componentUnderTest.type = 'ORDER';
        componentUnderTest.userCanAdministerQuotes = true;
        expect(componentUnderTest.shouldShowSetFocusedButton({ quoteStatus: 'PENDING' } as any)).toBe(false);
      });

      it('Should return false if the user doesnt have permission', () => {
        componentUnderTest.type = 'QUOTE';
        componentUnderTest.userCanAdministerQuotes = false;
        expect(componentUnderTest.shouldShowSetFocusedButton({ quoteStatus: 'PENDING' } as any)).toBe(false);
      });

      it('Should return false if the quote is not pending', () => {
        componentUnderTest.type = 'QUOTE';
        componentUnderTest.userCanAdministerQuotes = true;
        expect(componentUnderTest.shouldShowSetFocusedButton({ quoteStatus: 'notpending' } as any)).toBe(false);
      });
    });

    describe('shouldShowEditQuoteButton', () => {
      it('Should return true if all conditions are met', () => {
        componentUnderTest.type = 'QUOTE';
        componentUnderTest.userCanAdministerQuotes = true;
        expect(componentUnderTest.shouldShowEditQuoteButton({ quoteStatus: 'PENDING' } as any)).toBe(true);
      });

      it('Should return false if the type is order', () => {
        componentUnderTest.type = 'ORDER';
        componentUnderTest.userCanAdministerQuotes = true;
        expect(componentUnderTest.shouldShowEditQuoteButton({ quoteStatus: 'PENDING' } as any)).toBe(false);
      });

      it('Should return false if the user doesnt have permission', () => {
        componentUnderTest.type = 'QUOTE';
        componentUnderTest.userCanAdministerQuotes = false;
        expect(componentUnderTest.shouldShowEditQuoteButton({ quoteStatus: 'PENDING' } as any)).toBe(false);
      });

      it('Should return false if the quote is not pending', () => {
        componentUnderTest.type = 'QUOTE';
        componentUnderTest.userCanAdministerQuotes = true;
        expect(componentUnderTest.shouldShowEditQuoteButton({ quoteStatus: 'notpending' } as any)).toBe(false);
      });
    });

    describe('shouldShowViewQuoteButton', () => {
      it('should return true if all conditions are met', () => {
        componentUnderTest.type = 'QUOTE';
        expect(componentUnderTest.shouldShowViewQuoteButton({ quoteStatus: 'notpending' } as any)).toBe(true);
      });

      it('should return false if the type is order', () => {
        componentUnderTest.type = 'ORDER';
        expect(componentUnderTest.shouldShowViewQuoteButton({ quoteStatus: 'notpending' } as any)).toBe(false);
      });

      it('should return false if quote is pending', () => {
        componentUnderTest.type = 'QUOTE';
        expect(componentUnderTest.shouldShowViewQuoteButton({ quoteStatus: 'PENDING' } as any)).toBe(false);
      });
    });

    describe('shouldShowViewOrderButton()', () => {
      it('should return true if the type is order', () => {
        componentUnderTest.type = 'ORDER';
        expect(componentUnderTest.shouldShowViewOrderButton).toBe(true);
      });

      it('should return false if the type is quote', () => {
        componentUnderTest.type = 'QUOTE';
        expect(componentUnderTest.shouldShowViewOrderButton).toBe(false);
      });
    });
  });
};

