import { TimeDisplayComponent } from './time-display.component';

export function main() {
  xdescribe('Time Display Component', () => {
    let componentUnderTest: TimeDisplayComponent;

    beforeEach(() => {
      componentUnderTest = new TimeDisplayComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
