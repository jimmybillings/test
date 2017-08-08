import { TimeDisplayComponent } from './time-display.component';

export function main() {
  xdescribe('Time Display Component', () => {
    let componentUnderTest: TimeDisplayComponent;

    beforeEach(() => {
      componentUnderTest = new TimeDisplayComponent();
    });

    xit('has no testable functionality', () => {
      expect(true).toBe(true);
    });
  });
}
