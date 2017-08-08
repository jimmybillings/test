import { WzInputTagsComponent } from './wz-input-tags.component';

export function main() {
  xdescribe('Wz Input Tags Component', () => {
    let componentUnderTest: WzInputTagsComponent;

    beforeEach(() => {
      componentUnderTest = new WzInputTagsComponent(null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

