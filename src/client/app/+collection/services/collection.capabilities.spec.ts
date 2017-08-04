import { Observable } from 'rxjs/Observable';

import { CollectionCapabilities } from './collection.capabilities';

export function main() {
  describe('Collection Capabilities', () => {
    let capabilitiesUnderTest: CollectionCapabilities, mockCurrentUserService: any;

    beforeEach(() => {
      mockCurrentUserService = { data: Observable.of({ id: 123 }) };
      capabilitiesUnderTest = new CollectionCapabilities(mockCurrentUserService, null, null);
    });

    describe('editCollection()', () => {
      describe('returns true', () => {
        it('when the user owns the collection', () => {
          capabilitiesUnderTest.editCollection({ owner: 123 } as any).take(1).subscribe(d => expect(d).toBe(true));
        });

        it('when the user is an editor of the collection', () => {
          capabilitiesUnderTest.editCollection({ editors: [123] } as any).take(1).subscribe(d => expect(d).toBe(true));
        });
      });

      describe('returns false', () => {
        it('when the user doesn\'t own the collection', () => {
          capabilitiesUnderTest.editCollection({ owner: 1, editors: [] } as any).take(1).subscribe(d => expect(d).toBe(false));
        });

        it('when the user isn\'t an editor of the collection', () => {
          capabilitiesUnderTest.editCollection({ editors: [1] } as any).take(1).subscribe(d => expect(d).toBe(false));
        });
      });
    });
  });
};

