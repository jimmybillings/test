import { Tab } from './tab';

export function main() {
  describe('Cart Tab Base Class', () => {
    let classUnderTest: Tab;
    let mockEmitter: any;

    beforeEach(() => {
      mockEmitter = {
        emit: jasmine.createSpy('emit')
      };

      classUnderTest = new Tab(mockEmitter);
    });

    describe('goToPreviousTab()', () => {
      it('emits the expected event', () => {
        classUnderTest.goToPreviousTab();

        expect(mockEmitter.emit).toHaveBeenCalledWith({ type: 'GO_TO_PREVIOUS_TAB' });
      });
    });

    describe('goToNextTab()', () => {
      it('emits the expected event', () => {
        classUnderTest.goToNextTab();

        expect(mockEmitter.emit).toHaveBeenCalledWith({ type: 'GO_TO_NEXT_TAB' });
      });
    });
  });
};
