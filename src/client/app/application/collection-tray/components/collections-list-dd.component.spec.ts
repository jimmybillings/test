import { CollectionListDdComponent } from './collections-list-dd.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quotes Component', () => {
    let componentUnderTest: CollectionListDdComponent;

    beforeEach(() => {
      componentUnderTest = new CollectionListDdComponent(null, null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
