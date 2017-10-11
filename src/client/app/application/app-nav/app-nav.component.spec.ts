import { AppNavComponent } from './app-nav.component';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

export function main() {
  describe('App Nav Component', () => {
    let componentUnderTest: AppNavComponent;
    let mockStore: MockAppStore;

    beforeEach(() => {
      mockStore = new MockAppStore();
      componentUnderTest = new AppNavComponent(mockStore);
      componentUnderTest.trigger = { closeMenu: jasmine.createSpy('closeMenu') } as any;
      componentUnderTest.userPreference = {
        toggleSearch: jasmine.createSpy('toggleSearch'),
        toggleCollectionTray: jasmine.createSpy('toggleCollectionTray')
      };
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

    describe('headerIsFixed getter', () => {
      it('returns observable of true when the \'isFixed\' value is true in the store', () => {
        mockStore.createStateSection('headerDisplayOptions', { isFixed: true });
        let isFixed: boolean;
        componentUnderTest.headerIsFixed.take(1).subscribe(fixed => isFixed = fixed);
        expect(isFixed).toBe(true);
      });

      it('returns observable of false when the \'isFixed\' value is false in the store', () => {
        mockStore.createStateSection('headerDisplayOptions', { isFixed: false });
        let isFixed: boolean;
        componentUnderTest.headerIsFixed.take(1).subscribe(fixed => isFixed = fixed);
        expect(isFixed).toBe(false);
      });
    });

    describe('headerCanBeFixed getter', () => {
      it('returns observable of true when the \'isFixed\' value is true in the store', () => {
        mockStore.createStateSection('headerDisplayOptions', { canBeFixed: true });
        let canBeFixed: boolean;
        componentUnderTest.headerCanBeFixed.take(1).subscribe(fixed => canBeFixed = fixed);
        expect(canBeFixed).toBe(true);
      });

      it('returns observable of false when the \'canBeFixed\' value is false in the store', () => {
        mockStore.createStateSection('headerDisplayOptions', { canBeFixed: false });
        let canBeFixed: boolean;
        componentUnderTest.headerCanBeFixed.take(1).subscribe(fixed => canBeFixed = fixed);
        expect(canBeFixed).toBe(false);
      });
    });
  });
}
