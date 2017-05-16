import { LineItemActionsComponent } from './line-item-actions.component';

export function main() {
  describe('Line Item Actions Component', () => {
    let componentUnderTest: LineItemActionsComponent;

    beforeEach(() => {
      componentUnderTest = new LineItemActionsComponent();
    });

    describe('get displayPriceButton()', () => {
      describe('returns true', () => {
        it('when the asset is RM and quoteType is not ProvisionalOrder', () => {
          componentUnderTest.rightsReproduction = 'Rights Managed';
          componentUnderTest.quoteType = 'OfflineAgreement';

          expect(componentUnderTest.displayPriceButton).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the asset is not RM', () => {
          componentUnderTest.rightsReproduction = 'Royalty Free';
          componentUnderTest.quoteType = 'OfflineAgreement';

          expect(componentUnderTest.displayPriceButton).toBe(false);
        });

        it('when the asset is RM but the quote type is ProvisionalOrder', () => {
          componentUnderTest.rightsReproduction = 'Rights Managed';
          componentUnderTest.quoteType = 'ProvisionalOrder';

          expect(componentUnderTest.displayPriceButton).toBe(false);
        });

        it('when the asset is not RM AND the quote type is ProvisionalOrder', () => {
          componentUnderTest.rightsReproduction = 'Royalty Free';
          componentUnderTest.quoteType = 'ProvisionalOrder';

          expect(componentUnderTest.displayPriceButton).toBe(false);
        });
      });
    });

    describe('get needsAttributes()', () => {
      describe('returns true', () => {
        it('when the asset is Rights Managed and doesn\'t have a rights package', () => {
          componentUnderTest.rightsReproduction = 'Rights Managed';
          componentUnderTest.hasAttributes = false;

          expect(componentUnderTest.needsAttributes).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the asset is not Rights Managed', () => {
          componentUnderTest.rightsReproduction = 'Royalty Free';
          componentUnderTest.hasAttributes = false;

          expect(componentUnderTest.needsAttributes).toBe(false);
        });

        it('when the asset already has a rights package, even if it is RM', () => {
          componentUnderTest.rightsReproduction = 'Rights Managed';
          componentUnderTest.hasAttributes = true;

          expect(componentUnderTest.needsAttributes).toBe(false);
        });

        it('when the asset is not RM', () => {
          componentUnderTest.rightsReproduction = 'Royalty Free';
          componentUnderTest.hasAttributes = false;

          expect(componentUnderTest.needsAttributes).toBe(false);
        });
      });
    });

    describe('get shouldShowSubclipButton()', () => {
      describe('returns true', () => {
        it('when the user can create subclips and there aer other projects in the cart/quote', () => {
          componentUnderTest.userCanCreateSubclips = true;
          componentUnderTest.otherProjects = [1, 2];

          expect(componentUnderTest.shouldShowSubclipButton).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the user cannot create subclips', () => {
          componentUnderTest.userCanCreateSubclips = false;
          componentUnderTest.otherProjects = [1, 2];

          expect(componentUnderTest.shouldShowSubclipButton).toBe(false);
        });

        it('when there are no other projects in the cart/quote', () => {
          componentUnderTest.userCanCreateSubclips = true;
          componentUnderTest.otherProjects = [];

          expect(componentUnderTest.shouldShowSubclipButton).toBe(false);
        });

        it('when there are no other projects in the cart/quote AND the user cannot create subclips', () => {
          componentUnderTest.userCanCreateSubclips = false;
          componentUnderTest.otherProjects = [];

          expect(componentUnderTest.shouldShowSubclipButton).toBe(false);
        });
      });
    });

    describe('get otherProjectsExist()', () => {
      describe('returns true', () => {
        it('when there are other projects', () => {
          componentUnderTest.otherProjects = [1, 2, 3];

          expect(componentUnderTest.otherProjectsExist).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when there are no other projects', () => {
          componentUnderTest.otherProjects = [];

          expect(componentUnderTest.otherProjectsExist).toBe(false);
        });
      });
    });

    describe('get trStringForSubclipping()', () => {
      it('returns "COLLECTION.SHOW.ASSET_MORE_MENU.EDIT_SUBCLIPPING" when timeStart exists', () => {
        componentUnderTest.timeStart = 22;

        expect(componentUnderTest.trStringForSubclipping).toBe('COLLECTION.SHOW.ASSET_MORE_MENU.EDIT_SUBCLIPPING');
      });

      it('returns "COLLECTION.SHOW.ASSET_MORE_MENU.ADD_SUBCLIPPING" when timeStart is not set', () => {
        componentUnderTest.timeStart = -2;

        expect(componentUnderTest.trStringForSubclipping).toBe('COLLECTION.SHOW.ASSET_MORE_MENU.ADD_SUBCLIPPING');
      });
    });

    describe('get trStringForCostMultiplier()', () => {
      it('returns "QUOTE.EDIT_MULTIPLIER_TITLE" when there is a multiplier', () => {
        componentUnderTest.hasMultiplier = true;

        expect(componentUnderTest.trStringForCostMultiplier).toBe('QUOTE.EDIT_MULTIPLIER_TITLE');
      });

      it('returns "QUOTE.ADD_MULTIPLIER_TITLE" when there is NOT a multiplier', () => {
        componentUnderTest.hasMultiplier = false;

        expect(componentUnderTest.trStringForCostMultiplier).toBe('QUOTE.ADD_MULTIPLIER_TITLE');
      });
    });
  });
}
