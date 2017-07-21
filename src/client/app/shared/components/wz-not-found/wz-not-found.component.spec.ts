import { WzNotFoundComponent } from './wz-not-found.component';

export function main() {
  describe('Not Found Component', () => {
    let componentUnderTest: WzNotFoundComponent, mockUserCan: any;

    function newComponent(canAddToCart: boolean, canAdministerQuotes: boolean, canViewCollections: boolean) {
      mockUserCan = {
        addToCart: jasmine.createSpy('addToCart').and.returnValue(canAddToCart),
        administerQuotes: jasmine.createSpy('administerQuotes').and.returnValue(canAdministerQuotes),
        viewCollections: jasmine.createSpy('viewCollections').and.returnValue(canViewCollections)
      };
      componentUnderTest = new WzNotFoundComponent(mockUserCan);
    };

    describe('showCartLink', () => {
      it('should call addToCart and administerQuotes on the capabilities service', () => {
        newComponent(true, true, true);
        let res: any = componentUnderTest.showCartLink;

        expect(mockUserCan.addToCart).toHaveBeenCalled();
        expect(mockUserCan.administerQuotes).toHaveBeenCalled();
      });

      describe('returns true', () => {
        it('when both conditions are met', () => {
          newComponent(true, false, true);
          let res: any = componentUnderTest.showCartLink;

          expect(res).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when a user can administerQuotes', () => {
          newComponent(true, true, true);
          let res: any = componentUnderTest.showCartLink;

          expect(res).toBe(false);
        });

        it('when a user can\'t addToCart', () => {
          newComponent(false, true, true);
          let res: any = componentUnderTest.showCartLink;

          expect(res).toBe(false);
        });
      });
    });

    describe('showCollectionsLink', () => {
      it('should call viewCollections on the capabilities service', () => {
        let res: any = componentUnderTest.showCollectionsLink;

        expect(mockUserCan.viewCollections).toHaveBeenCalled();
      });

      describe('returns true', () => {
        it('when a user can viewCollections', () => {
          newComponent(true, true, true);
          let res: any = componentUnderTest.showCollectionsLink;

          expect(res).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when a user can\'t viewCollections', () => {
          newComponent(true, true, false);
          let res: any = componentUnderTest.showCollectionsLink;

          expect(res).toBe(false);
        });
      });
    });

    describe('showQuotesLink', () => {
      it('should call administerQuotes on the capabilities service', () => {
        let res: any = componentUnderTest.showQuotesLink;

        expect(mockUserCan.administerQuotes).toHaveBeenCalled();
      });

      describe('returns true', () => {
        it('when a user can administerQuotes', () => {
          newComponent(true, true, true);
          let res: boolean = componentUnderTest.showQuotesLink;

          expect(res).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when a user can\'t administerQuotes', () => {
          newComponent(true, false, true);
          let res: boolean = componentUnderTest.showQuotesLink;

          expect(res).toBe(false);
        });
      });
    });
  });
}
