import { ProjectsComponent } from './projects.component';

export function main() {
  describe('Projects', () => {
    let classUnderTest: ProjectsComponent;
    let mockDialogService: any;

    beforeEach(() => {
      mockDialogService = {
        openFormDialog: jasmine.createSpy('openFormDialog').and.callFake((_: any, __: any, onSubmitCallback: Function) => {
          mockDialogService.onSubmitCallback = onSubmitCallback;
        })
      };

      classUnderTest = new ProjectsComponent(mockDialogService);
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
      beforeEach(() => classUnderTest.config = { addQuoteFee: { items: [] } });

      it('opens a dialog', () => {
        classUnderTest.onClickAddFeeButtonFor({ some: 'project' } as any);

        expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
          classUnderTest.config.addQuoteFee.items,
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
