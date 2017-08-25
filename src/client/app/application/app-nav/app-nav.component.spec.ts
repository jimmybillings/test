import { AppNavComponent } from './app-nav.component';

export function main() {
  describe('App Nav Component', () => {
    let componentUnderTest: AppNavComponent;

    beforeEach(() => {
      componentUnderTest = new AppNavComponent();
      componentUnderTest.trigger = { closeMenu: jasmine.createSpy('closeMenu') } as any;
      componentUnderTest.userPreference = {
        toggleSearch: jasmine.createSpy('toggleSearch'),
        toggleCollectionTray: jasmine.createSpy('toggleCollectionTray')
      };
      componentUnderTest.uiState = { showNewCollection: jasmine.createSpy('showNewCollection') };
    });

    describe('logOut()', () => {
      it('should fire an event to logout a user', () => {
        spyOn(componentUnderTest.onLogOut, 'emit');
        componentUnderTest.logOut(event);
        expect(componentUnderTest.onLogOut.emit).toHaveBeenCalledWith(event);
      });

      it('close the menu', () => {
        componentUnderTest.logOut(event);
        expect(componentUnderTest.trigger.closeMenu).toHaveBeenCalled();
      });
    });

    describe('toggleSearch', () => {
      it('should call toggleSearch() on the user preference object', () => {
        componentUnderTest.toggleSearch();
        expect(componentUnderTest.userPreference.toggleSearch).toHaveBeenCalled();
      });
    });

    describe('toggleCollectionTray', () => {
      it('should call toggleCollectionTray() on the user preference object', () => {
        componentUnderTest.toggleCollectionTray();
        expect(componentUnderTest.userPreference.toggleCollectionTray).toHaveBeenCalled();
      });
    });

    describe('showNewCollection()', () => {
      it('should call showNewCollection() on the uiState object', () => {
        componentUnderTest.showNewCollection();
        expect(componentUnderTest.uiState.showNewCollection).toHaveBeenCalled();
      });
    });

    describe('formatBadgeNumber()', () => {
      const numbers = [0, 1, 99];

      numbers.forEach((num: number) => {
        it(`should return "${num}" when the size is ${num}`, () => {
          expect(componentUnderTest.formatBadgeNumber(num)).toBe(num.toString());
        });
      });

      it('should return "99+" if the number is larger than 99', () => {
        expect(componentUnderTest.formatBadgeNumber(100)).toBe('99+');
      });
    });
  });
}
