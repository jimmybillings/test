import { FilterComponent } from './filter.component';

export function main() {
  describe('Filter Component', () => {
    let mockSearchComponent: any;
    let componentUnderTest: FilterComponent;

    beforeEach(() => {
      componentUnderTest = new FilterComponent();
      componentUnderTest.onFilterEvent = {
        emit: jasmine.createSpy('emit')
      };
    });

    describe('toggleFilter()', () => {
      it('delegates to SearchComponent', () => {
        componentUnderTest.toggleFilter({ mockFilter: 'mockFilter' });

        expect(componentUnderTest.onFilterEvent.emit).toHaveBeenCalledWith(
          { event: 'toggleFilter', filter: { mockFilter: 'mockFilter' } });
      });

    });

    describe('applyDateRange()', () => {
      let mockEvent: any;
      let mockFilter: any;

      beforeEach(() => {
        mockEvent = { target: {} };
        mockFilter = { some: 'filter' };
      });

      it('sets event target\'s "event" property to a formatted version of "value" property', () => {
        mockEvent.target = { value: 'Thu Dec 1 2016', name: 'start' };

        componentUnderTest.applyDateRange(mockEvent, mockFilter);

        expect(mockEvent.target.event).toEqual('2016-12-01');
      });

      it('sets dateRange start value to a formatted version of "value" property', () => {
        mockEvent.target = { value: 'Thu Dec 1 2016', name: 'start' };

        componentUnderTest.applyDateRange(mockEvent, mockFilter);

        expect(componentUnderTest.dateRange.start).toEqual('2016-12-01');
      });

      it('sets dateRange end value to a formatted version of "value" property', () => {
        mockEvent.target = { value: 'Thu Dec 15 2016', name: 'end' };

        componentUnderTest.applyDateRange(mockEvent, mockFilter);

        expect(componentUnderTest.dateRange.end).toEqual('2016-12-15');
      });

      it('throws an exception for an unknown "name" property', () => {
        mockEvent.target = { name: 'whatever' };

        expect(() => componentUnderTest.applyDateRange(mockEvent, mockFilter)).toThrowError(TypeError);
      });

      it('throws an exception when event target\'s "value" property is not a date', () => {
        mockEvent.target = { value: 'blah' };

        expect(() => componentUnderTest.applyDateRange(mockEvent, mockFilter)).toThrowError(TypeError);
      });

      it('throws an exception when event target\'s "value" property is not present', () => {
        expect(() => componentUnderTest.applyDateRange(mockEvent, mockFilter)).toThrowError(TypeError);
      });

      it('applies the search filter with the end of time when only the start date is present', () => {
        mockEvent.target = { value: 'Sat Dec 3 2016', name: 'start' };

        componentUnderTest.applyDateRange(mockEvent, mockFilter);

        expect(componentUnderTest.onFilterEvent.emit).toHaveBeenCalledWith({
          event: 'applyCustomValue',
          filter: mockFilter,
          customValue: '2016-12-03 - 3000-01-01'
        });
      });

      it('applies the search filter with the beginning of time when only the end date is present', () => {
        mockEvent.target = { value: 'Sun Dec 4 2016', name: 'end' };

        componentUnderTest.applyDateRange(mockEvent, mockFilter);

        expect(componentUnderTest.onFilterEvent.emit).toHaveBeenCalledWith({
          event: 'applyCustomValue',
          filter: mockFilter,
          customValue: '1000-01-01 - 2016-12-04'
        });
      });

      it('applies proper search filters twice as both dates are selected', () => {
        mockEvent.target = { value: 'Mon Dec 5 2016', name: 'start' };
        componentUnderTest.applyDateRange(mockEvent, mockFilter);

        expect(componentUnderTest.onFilterEvent.emit).toHaveBeenCalledWith({
          event: 'applyCustomValue',
          filter: mockFilter,
          customValue: '2016-12-05 - 3000-01-01'
        });

        mockEvent.target = { value: 'Fri Dec 23 2016', name: 'end' };
        componentUnderTest.applyDateRange(mockEvent, mockFilter);

        expect(componentUnderTest.onFilterEvent.emit).toHaveBeenCalledWith({
          event: 'applyCustomValue',
          filter: mockFilter,
          customValue: '2016-12-05 - 2016-12-23'
        });
      });
    });

    describe('defaultDate()', () => {
      describe('with a filter value', () => {
        const mockFilter: any = { filterValue: '2016-01-01 - 2016-12-31' };

        it('returns the start value from the filter', () => {
          expect(componentUnderTest.defaultDate(mockFilter, 'start'))
            .toEqual('2016-01-01');
        });

        it('returns null if the start value from the filter is the beginning of time', () => {
          expect(componentUnderTest.defaultDate({ filterValue: '1000-01-01 - 2016-12-31' }, 'start'))
            .toBeNull();
        });

        it('sets the dateRange start value from the filter (SIDE EFFECT!)', () => {
          componentUnderTest.defaultDate(mockFilter, 'start');

          expect(componentUnderTest.dateRange.start).toEqual('2016-01-01');
        });

        it('returns the end value from the filter', () => {
          expect(componentUnderTest.defaultDate(mockFilter, 'end'))
            .toEqual('2016-12-31');
        });

        it('returns null if the end value from the filter is the end of time', () => {
          expect(componentUnderTest.defaultDate({ filterValue: '2016-01-01 - 3000-01-01' }, 'end'))
            .toBeNull();
        });

        it('sets the dateRange end value from the filter (SIDE EFFECT!)', () => {
          componentUnderTest.defaultDate(mockFilter, 'end');

          expect(componentUnderTest.dateRange.end).toEqual('2016-12-31');
        });
      });

      for (const badFilter of [{}, null, undefined]) {
        describe(`without a filter value (filter argument = ${JSON.stringify(badFilter)})`, () => {
          describe('with an existing dateRange value', () => {
            beforeEach(() => {
              componentUnderTest.dateRange.start = '2017-06-01';
              componentUnderTest.dateRange.end = '2017-06-30';
            });

            it('returns the existing dateRange start value', () => {
              expect(componentUnderTest.defaultDate(badFilter, 'start')).toEqual('2017-06-01');
            });

            it('preserves the existing dateRange start value', () => {
              componentUnderTest.defaultDate(badFilter, 'start');

              expect(componentUnderTest.dateRange.start).toEqual('2017-06-01');
            });

            it('returns the existing dateRange end value', () => {
              expect(componentUnderTest.defaultDate(badFilter, 'end')).toEqual('2017-06-30');
            });

            it('preserves the existing dateRange end value', () => {
              componentUnderTest.defaultDate(badFilter, 'end');

              expect(componentUnderTest.dateRange.end).toEqual('2017-06-30');
            });
          });

          describe('without an existing dateRange value', () => {
            it('returns null as the start value', () => {
              expect(componentUnderTest.defaultDate(badFilter, 'start')).toBeNull();
            });

            it('preserves the existing null dateRange start value', () => {
              componentUnderTest.dateRange.start = null;

              componentUnderTest.defaultDate(badFilter, 'start');

              expect(componentUnderTest.dateRange.start).toBeNull();
            });

            it('returns null as the end value', () => {
              expect(componentUnderTest.defaultDate(badFilter, 'end')).toBeNull();
            });

            it('preserves the existing null dateRange end value', () => {
              componentUnderTest.dateRange.end = null;

              componentUnderTest.defaultDate(badFilter, 'end');

              expect(componentUnderTest.dateRange.end).toBeNull();
            });
          });
        });
      }
    });
  });
}
