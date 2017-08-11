import { ActionFactory } from './speed-preview.actions';

export function main() {
  xdescribe('Action Factory', () => {
    let actionsUnderTest: ActionFactory;

    beforeEach(() => {
      actionsUnderTest = new ActionFactory();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
