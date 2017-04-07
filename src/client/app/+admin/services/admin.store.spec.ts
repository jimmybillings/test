import { Observable } from 'rxjs/Observable';

import { adminResources, AdminStore } from './admin.store';

export function main() {
  describe('adminResources reducer', () => {
    it('returns the payload for ADMIN_SERVICE.SET_RESOURCES', () => {
      expect(adminResources({ items: [], pagination: {} },
        { type: 'ADMIN_SERVICE.SET_RESOURCES', payload: { items: ['one'], pagination: {} } }))
        .toEqual({ items: ['one'], pagination: {} });
    });

    it('returns the current state for an unexpected action type', () => {
      expect(adminResources({ items: [], pagination: {} }, { type: 'INVALID', payload: { items: ['one'] } }))
        .toEqual({ items: [], pagination: {} });
    });

    it('returns the default state for no current state and an unexpected action type', () => {
      expect(adminResources(undefined, { type: 'BLAH', payload: { items: ['one'] } }))
        .toEqual({ items: [], pagination: {} });
    });
  });

  describe('Admin Store', () => {
    let mockStore: any;
    let storeUnderTest: AdminStore;
    let mockData: any;
    beforeEach(() => {
      mockData = {
        items: ['one', 'two', 'three'],
        totalCount: 10,
        currentPage: 0,
        hasNextPage: true,
        hasPreviousPage: false,
        numberOfPages: 1,
        pageSize: 20
      };
      mockStore = {
        select: jasmine.createSpy('select').and.returnValue(Observable.of({ items: ['one'] })),
        dispatch: jasmine.createSpy('dispatch')
      };
      storeUnderTest = new AdminStore(mockStore);
    });

    describe('get data()', () => {
      it('accesses the right part of the global store', () => {
        storeUnderTest.data.subscribe();
        expect(mockStore.select).toHaveBeenCalledWith('adminResources');
      });

      it('returns the expected data', () => {
        storeUnderTest.data.subscribe(data => {
          expect(data).toEqual({ items: ['one'] });
        });
      });
    });

    describe('set()', () => {
      it('dispatches ADMIN_SERVICE.SET_RESOURCES with the passed-in payload', () => {
        storeUnderTest.set(mockData);

        expect(mockStore.dispatch)
          .toHaveBeenCalledWith({
            type: 'ADMIN_SERVICE.SET_RESOURCES',
            payload: {
              items: mockData.items,
              pagination: {
                totalCount: 10,
                currentPage: 1,
                hasNextPage: true,
                hasPreviousPage: false,
                numberOfPages: 1,
                pageSize: 20
              }
            }
          });
      });
    });

    describe('state()', () => {
      it('returns the current store state', () => {
        expect(storeUnderTest.state).toEqual({ items: ['one'] });
      });
    });
  });
}
