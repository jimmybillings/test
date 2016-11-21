import { collections, CollectionsStore } from './collections.store';
import { Collections } from '../interfaces/collection.interface';
import { addStandardReducerTestsFor } from '../tests/reducer';

export function main() {
  const initialState: Collections = {
    items: [],
    pagination: {
      totalCount: 0,
      currentPage: 1,
      pageSize: 100,
      hasNextPage: false,
      hasPreviousPage: false,
      numberOfPages: 0
    }
  };

  describe('REPLACE_COLLECTIONS', () => {
    addStandardReducerTestsFor(collections, 'REPLACE_COLLECTIONS', initialState);

    it('returns payload when current state is passed in', () => {
      expect(collections(
        { property1: 'existing1', property2: 'existing2' },
        { type: 'REPLACE_COLLECTIONS', payload: { property1: 'new', other: 'stuff' } }
      ))
        .toEqual({ property1: 'new', other: 'stuff' });
    });

    it('returns payload when current state is not passed in', () => {
      expect(collections(undefined, { type: 'REPLACE_COLLECTIONS', payload: { some: 'payload' } }))
        .toEqual({ some: 'payload' });
    });

    it('returns initial state when payload is not passed in', () => {
      expect(collections(
        { property1: 'existing1', property2: 'existing2' },
        { type: 'REPLACE_COLLECTIONS' }
      ))
        .toEqual(initialState);
    });
  });

  describe('ADD_COLLECTION', () => {
    addStandardReducerTestsFor(collections, 'ADD_COLLECTION', initialState);

    it('returns current state merged with payload when current state is passed in', () => {
      expect(collections(
        { items: [{ collection: '1' }, { collection: '2' }] },
        { type: 'ADD_COLLECTION', payload: { collection: '3' } }
      ))
        .toEqual({ items: [{ collection: '1' }, { collection: '2' }, { collection: '3' }] });
    });

    it('returns initial state merged with payload when current state is not passed in', () => {
      const expectedResult = JSON.parse(JSON.stringify(initialState));
      expectedResult.items = [{ collection: '42' }];

      expect(collections(undefined, { type: 'ADD_COLLECTION', payload: { collection: '42' } }))
        .toEqual(expectedResult);
    });

    it('returns current state merged with payload when current state does not define items', () => {
      expect(collections(
        { some: 'nonitems' },
        { type: 'ADD_COLLECTION', payload: { collection: '123' } }
      ))
        .toEqual({ some: 'nonitems', items: [{ collection: '123' }] });
    });

    it('returns current state unchanged when payload is not passed in', () => {
      expect(collections(
        { items: [{ collection: '1' }, { collection: '2' }] },
        { type: 'ADD_COLLECTION' }
      ))
        .toEqual({ items: [{ collection: '1' }, { collection: '2' }] });
    });
  });

  describe('UPDATE_COLLECTION', () => {
    const tempInitialState = { items: [{ id: 42, content: 'original' }] };
    const tempPayload = { id: 42, content: 'new' };

    addStandardReducerTestsFor(collections, 'UPDATE_COLLECTION', tempInitialState, tempPayload);

    it('returns current state updated with payload collection when current state is passed in', () => {
      expect(collections(tempInitialState, { type: 'UPDATE_COLLECTION', payload: tempPayload }))
        .toEqual({ items: [{ id: 42, content: 'new' }] });
    });

    it('returns initial state unchanged when current state is not passed in', () => {
      expect(collections(undefined, { type: 'UPDATE_COLLECTION', payload: tempPayload }))
        .toEqual(initialState);
    });

    it('returns current state unchanged when payload is a nonexistent collection', () => {
      expect(collections(tempInitialState, { type: 'UPDATE_COLLECTION', payload: { id: 17, content: 'whatever' } }))
        .toEqual({ items: [{ id: 42, content: 'original' }] });
    });

    it('returns current state unchanged when current state does not define items', () => {
      expect(collections({ some: 'nonitems' }, { type: 'UPDATE_COLLECTION', payload: tempPayload }))
        .toEqual({ some: 'nonitems' });
    });

    it('returns current state unchanged when payload is not passed in', () => {
      expect(collections(tempInitialState, { type: 'UPDATE_COLLECTION' }))
        .toEqual(tempInitialState);
    });
  });

  describe('DELETE_COLLECTION', () => {
    const tempInitialState = { items: [{ id: 25, content: 'whatever' }] };
    const tempPayload = 25;

    addStandardReducerTestsFor(collections, 'DELETE_COLLECTION', tempInitialState, tempPayload);

    it('returns current state minus the collection with the payload ID when current state is passed in', () => {
      expect(collections(
        { items: [{ id: 123 }, { id: 456 }] },
        { type: 'DELETE_COLLECTION', payload: 123 }
      ))
        .toEqual({ items: [{ id: 456 }] });
    });

    it('returns initial state when current state is not passed in', () => {
      expect(collections(undefined, { type: 'DELETE_COLLECTION', payload: 123 }))
        .toEqual(initialState);
    });

    it('returns current state unchanged when current state does not define items', () => {
      expect(collections({ some: 'nonitems' }, { type: 'DELETE_COLLECTION', payload: 99 }))
        .toEqual({ some: 'nonitems' });
    });

    it('returns current state unchanged when payload is not passed in', () => {
      expect(collections(tempInitialState, { type: 'DELETE_COLLECTION' }))
        .toEqual(tempInitialState);
    });
  });

  describe('DELETE_ALL_COLLECTIONS', () => {
    it('returns initial state when current state is passed in', () => {
      expect(collections(
        { property1: 'existing1', property2: 'existing2' },
        { type: 'DELETE_ALL_COLLECTIONS' }
      ))
        .toEqual(initialState);
    });

    it('returns initial state when current state is not passed in', () => {
      expect(collections(undefined, { type: 'DELETE_ALL_COLLECTIONS' }))
        .toEqual(initialState);
    });
  });
};

describe('Collections Store', () => {
  let storeUnderTest: CollectionsStore;

  beforeEach(() => {
    storeUnderTest = new CollectionsStore(null);
  });

  it('has no tests!', () => {
    expect(true).toBe(true);
  });
});
