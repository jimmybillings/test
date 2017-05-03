import { Observable } from 'rxjs/Observable';

import { ProjectsComponent } from './projects.component';

export function main() {
  describe('Projects', () => {
    let classUnderTest: ProjectsComponent;
    let mockDialogService: any;
    let mockQuoteEditService: any;

    beforeEach(() => {
      mockDialogService = {
        openFormDialog: jasmine.createSpy('openFormDialog').and.callFake((_: any, __: any, onSubmitCallback: Function) => {
          mockDialogService.onSubmitCallback = onSubmitCallback;
        })
      };

      mockQuoteEditService = {
        feeConfig: Observable.of({ some: 'fee config' })
      };

      classUnderTest = new ProjectsComponent(mockDialogService, mockQuoteEditService);
      classUnderTest.projectsNotify.emit = jasmine.createSpy('projectsNotify');
    });

    describe('projectsOtherThan()', () => {
      it('returns projects other than the one specified', () => {
        let project1: any = { id: '1' };
        let project2: any = { id: '2' };
        let project3: any = { id: '3' };
        classUnderTest.projects = [project1, project2, project3];

        expect(classUnderTest.projectsOtherThan(project2))
          .toEqual([project1, project3]);
      });
    });

    describe('lineItemCountFor()', () => {
      it('returns the number of lineitems in the project', () => {
        let project: any = { lineItems: [{}, {}, {}] };

        expect(classUnderTest.lineItemCountFor(project)).toBe(3);
      });

      it('returns zero if the project has no lineItems defined', () => {
        let project: any = {};

        expect(classUnderTest.lineItemCountFor(project)).toBe(0);
      });
    });

    describe('addProject()', () => {
      it('emits the proper request event', () => {
        classUnderTest.projectsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'ADD_PROJECT' });
          });

        classUnderTest.addProject();
      });
    });

    describe('remove()', () => {
      it('emits the proper request event', () => {
        let project: any = { some: 'project' };

        classUnderTest.projectsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'REMOVE_PROJECT', payload: project });
          });

        classUnderTest.onRemove(project);
      });
    });

    describe('edit()', () => {
      it('emits the proper request event', () => {
        let project: any = { a: 'b', c: 'd', e: 'f' };

        classUnderTest.config = {
          form: {
            items: [
              { name: 'a', value: 'x' },
              { name: 'c', value: 'x' },
              { name: 'e', value: 'x' }
            ]
          }
        };

        classUnderTest.projectsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({
              type: 'UPDATE_PROJECT', payload: {
                project: { a: 'b', c: 'd', e: 'f' },
                items: [{ name: 'a', value: 'b' }, { name: 'c', value: 'd' }, { name: 'e', value: 'f' }]
              }
            });
          });

        classUnderTest.onEdit(project);
      });
    });

    describe('delegate()', () => {
      it('forwards events', () => {
        classUnderTest.projectsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ some: 'event' });
          });

        classUnderTest.delegate({ some: 'event' });
      });
    });

    describe('onClickAddFeeButtonFor()', () => {
      beforeEach(() => {
        classUnderTest.config = { addQuoteFee: { items: [{ name: 'feeType' }, { name: 'amount' }] } };

        mockQuoteEditService.feeConfig = Observable.of({
          items: [
            { name: 'fee1', amount: 100 },
            { name: 'fee2', amount: 200 },
            { name: 'fee3', amount: .5 },
            { name: 'fee4', amount: 123.45 },
            { name: 'fee5', amount: 0 },
            { name: 'fee6' }
          ]
        });
      });

      it('opens a dialog', () => {
        classUnderTest.onClickAddFeeButtonFor({ some: 'project' } as any);

        const expectedItems: any = [
          {
            name: 'feeType',
            options: 'fee1,fee2,fee3,fee4,fee5,fee6',
            value: 'fee1',
            slaveFieldName: 'amount',
            slaveFieldValues: ['100.00', '200.00', '0.50', '123.45', '0.00', '0.00']
          },
          {
            name: 'amount',
            value: '100.00'
          }
        ];

        expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
          expectedItems,
          { title: 'QUOTE.ADD_FEE.HEADER', submitLabel: 'QUOTE.ADD_FEE.SUBMIT' },
          jasmine.any(Function)
        );
      });

      it('can open a dialog when UI config form has no amount', () => {
        classUnderTest.config = { addQuoteFee: { items: [{ name: 'feeType' }] } };

        classUnderTest.onClickAddFeeButtonFor({ some: 'project' } as any);

        const expectedItems: any = [
          {
            name: 'feeType',
            options: 'fee1,fee2,fee3,fee4,fee5,fee6',
            value: 'fee1'
          }
        ];

        expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
          expectedItems,
          { title: 'QUOTE.ADD_FEE.HEADER', submitLabel: 'QUOTE.ADD_FEE.SUBMIT' },
          jasmine.any(Function)
        );
      });

      it('can open a dialog when UI config form has no fee type', () => {
        classUnderTest.config = { addQuoteFee: { items: [{ whatever: 'stuff' }] } };

        classUnderTest.onClickAddFeeButtonFor({ some: 'project' } as any);

        expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
          [{ whatever: 'stuff' }],
          { title: 'QUOTE.ADD_FEE.HEADER', submitLabel: 'QUOTE.ADD_FEE.SUBMIT' },
          jasmine.any(Function)
        );
      });

      it('emits the expected event when the dialog is submitted', () => {
        classUnderTest.onClickAddFeeButtonFor({ some: 'project' } as any);

        mockDialogService.onSubmitCallback({ some: 'fee' });

        expect(classUnderTest.projectsNotify.emit).toHaveBeenCalledWith({
          type: 'ADD_QUOTE_FEE',
          payload: { project: { some: 'project' }, fee: { some: 'fee' } }
        });
      });
    });

    describe('selectProject()', () => {
      it('updates its config form items', () => {
        let project: any = { a: 'b', c: 'd', e: 'f' };

        classUnderTest.config = {
          form: {
            items: [
              { name: 'a', value: 'x' },
              { name: 'c', value: 'x' },
              { name: 'e', value: 'x' }
            ]
          }
        };

        classUnderTest.selectProject(project);

        expect(classUnderTest.config.form.items).toEqual([
          { name: 'a', value: 'b' },
          { name: 'c', value: 'd' },
          { name: 'e', value: 'f' }
        ]);
      });
    });
  });
}
