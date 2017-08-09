import { CollectionListDdComponent } from './collections-list-dd.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  xdescribe('Quotes Component', () => {
    let componentUnderTest: CollectionListDdComponent;

    beforeEach(() => {
      componentUnderTest = new CollectionListDdComponent(null, null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
